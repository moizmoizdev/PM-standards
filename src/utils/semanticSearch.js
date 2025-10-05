import { pipeline, env } from '@xenova/transformers'

// Configure transformers.js environment
env.allowRemoteModels = true
env.allowLocalModels = false

class SemanticSearchEngine {
  constructor() {
    this.extractor = null
    this.isLoading = false
    this.embeddings = new Map() // Cache for text embeddings
    this.modelName = 'Xenova/all-MiniLM-L6-v2' // Lightweight, fast model
  }

  // Initialize the model
  async initialize() {
    if (this.extractor) return this.extractor
    if (this.isLoading) {
      // Wait for existing initialization
      while (this.isLoading) {
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      return this.extractor
    }

    try {
      this.isLoading = true
      console.log('Loading semantic search model...')
      this.extractor = await pipeline('feature-extraction', this.modelName)
      console.log('Semantic search model loaded successfully!')
      return this.extractor
    } catch (error) {
      console.error('Failed to load semantic search model:', error)
      throw error
    } finally {
      this.isLoading = false
    }
  }

  // Calculate cosine similarity between two vectors
  cosineSimilarity(a, b) {
    const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0)
    const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0))
    const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0))
    return dotProduct / (magnitudeA * magnitudeB)
  }

  // Generate embedding for text
  async getEmbedding(text) {
    if (!text || text.trim().length === 0) return null
    
    // Check cache first
    const cacheKey = text.trim().toLowerCase()
    if (this.embeddings.has(cacheKey)) {
      return this.embeddings.get(cacheKey)
    }

    await this.initialize()
    
    try {
      const output = await this.extractor(text, { pooling: 'mean', normalize: true })
      const embedding = Array.from(output.data)
      
      // Cache the embedding
      this.embeddings.set(cacheKey, embedding)
      return embedding
    } catch (error) {
      console.error('Error generating embedding:', error)
      return null
    }
  }

  // Segment text into chunks for better semantic search
  segmentText(text, maxLength = 500) {
    if (!text || text.length <= maxLength) return [text]
    
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0)
    const segments = []
    let currentSegment = ''
    
    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim()
      if (currentSegment.length + trimmedSentence.length <= maxLength) {
        currentSegment += (currentSegment ? '. ' : '') + trimmedSentence
      } else {
        if (currentSegment) {
          segments.push(currentSegment + '.')
          currentSegment = trimmedSentence
        } else {
          // Handle very long sentences by splitting on commas or words
          const words = trimmedSentence.split(' ')
          let wordChunk = ''
          for (const word of words) {
            if (wordChunk.length + word.length <= maxLength) {
              wordChunk += (wordChunk ? ' ' : '') + word
            } else {
              if (wordChunk) segments.push(wordChunk)
              wordChunk = word
            }
          }
          if (wordChunk) currentSegment = wordChunk
        }
      }
    }
    
    if (currentSegment) {
      segments.push(currentSegment + (currentSegment.endsWith('.') ? '' : '.'))
    }
    
    return segments.filter(s => s.trim().length > 20) // Filter out very short segments
  }

  // Perform semantic search on a collection of records
  async semanticSearch(records, query, options = {}) {
    const {
      threshold = 0.3,
      maxResults = 10,
      segmentLength = 500,
      includeStructuralSearch = true
    } = options

    if (!query || query.trim().length < 2) return []

    await this.initialize()
    
    try {
      // Get query embedding
      const queryEmbedding = await this.getEmbedding(query.trim())
      if (!queryEmbedding) return []

      const results = []
      const queryLower = query.toLowerCase()

      for (const record of records) {
        // Skip invalid records
        if (!record.content || record.content.trim().length < 20) continue

        let bestScore = 0
        let bestSegment = ''
        let matchType = 'semantic'

        // First check for structural matches (higher priority)
        if (includeStructuralSearch) {
          const structuralScore = this.calculateStructuralScore(record, queryLower)
          if (structuralScore > 0) {
            bestScore = Math.min(0.95, 0.7 + structuralScore * 0.25) // Boost structural matches
            bestSegment = record.content.substring(0, Math.min(300, record.content.length))
            matchType = 'structural'
          }
        }

        // Semantic search on content segments
        const segments = this.segmentText(record.content, segmentLength)
        
        for (const segment of segments) {
          const segmentEmbedding = await this.getEmbedding(segment)
          if (!segmentEmbedding) continue

          const similarity = this.cosineSimilarity(queryEmbedding, segmentEmbedding)
          
          if (similarity > bestScore) {
            bestScore = similarity
            bestSegment = segment
            matchType = 'semantic'
          }
        }

        // Add to results if above threshold
        if (bestScore >= threshold) {
          results.push({
            ...record,
            semanticScore: bestScore,
            matchedSegment: bestSegment,
            matchType,
            relevanceScore: bestScore * 100 // Convert to percentage for UI
          })
        }
      }

      // Sort by semantic score (descending) and limit results
      return results
        .sort((a, b) => b.semanticScore - a.semanticScore)
        .slice(0, maxResults)

    } catch (error) {
      console.error('Semantic search error:', error)
      return []
    }
  }

  // Calculate structural match score (topics, subtopics, etc.)
  calculateStructuralScore(record, queryLower) {
    let score = 0
    
    if (record.topic && record.topic.toLowerCase().includes(queryLower)) {
      score += 0.8
    }
    if (record.subtopic && record.subtopic.toLowerCase().includes(queryLower)) {
      score += 0.6
    }
    if (record.subsubtopic && record.subsubtopic.toLowerCase().includes(queryLower)) {
      score += 0.4
    }
    
    return Math.min(score, 1.0)
  }

  // Hybrid search combining semantic and keyword search
  async hybridSearch(records, query, options = {}) {
    const {
      semanticWeight = 0.7,
      keywordWeight = 0.3,
      ...otherOptions
    } = options

    // Get semantic results
    const semanticResults = await this.semanticSearch(records, query, otherOptions)
    
    // Get keyword results (simple text matching)
    const keywordResults = this.keywordSearch(records, query, otherOptions)
    
    // Combine and re-rank results
    const combinedResults = new Map()
    
    // Add semantic results
    semanticResults.forEach(result => {
      const key = `${result.topic}-${result.subtopic}-${result.subsubtopic}`
      combinedResults.set(key, {
        ...result,
        hybridScore: result.semanticScore * semanticWeight
      })
    })
    
    // Add keyword results and combine scores
    keywordResults.forEach(result => {
      const key = `${result.topic}-${result.subtopic}-${result.subsubtopic}`
      if (combinedResults.has(key)) {
        const existing = combinedResults.get(key)
        existing.hybridScore += result.relevanceScore / 100 * keywordWeight
        existing.matchType = 'hybrid'
      } else {
        combinedResults.set(key, {
          ...result,
          hybridScore: result.relevanceScore / 100 * keywordWeight,
          semanticScore: result.relevanceScore / 100,
          matchType: 'keyword'
        })
      }
    })
    
    // Sort by hybrid score and return
    return Array.from(combinedResults.values())
      .sort((a, b) => b.hybridScore - a.hybridScore)
      .slice(0, otherOptions.maxResults || 10)
  }

  // Simple keyword search for comparison
  keywordSearch(records, query, options = {}) {
    const { threshold = 0.3, maxResults = 10 } = options
    const queryLower = query.toLowerCase()
    const results = []

    for (const record of records) {
      if (!record.content) continue

      let score = 0
      const contentLower = record.content.toLowerCase()
      
      // Exact phrase match
      if (contentLower.includes(queryLower)) {
        score += 0.8
      }
      
      // Individual word matches
      const queryWords = queryLower.split(/\s+/).filter(w => w.length > 2)
      const contentWords = contentLower.split(/\s+/)
      const matchedWords = queryWords.filter(qw => contentWords.some(cw => cw.includes(qw)))
      score += (matchedWords.length / queryWords.length) * 0.6

      // Structural matches
      score += this.calculateStructuralScore(record, queryLower)

      if (score >= threshold) {
        // Find context around the match
        const matchIndex = contentLower.indexOf(queryLower)
        let context = record.content
        if (matchIndex !== -1) {
          const start = Math.max(0, matchIndex - 100)
          const end = Math.min(record.content.length, matchIndex + queryLower.length + 100)
          context = record.content.substring(start, end)
        }

        results.push({
          ...record,
          relevanceScore: score * 100,
          matchedSegment: context,
          matchType: 'keyword'
        })
      }
    }

    return results
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxResults)
  }

  // Clear embeddings cache
  clearCache() {
    this.embeddings.clear()
  }

  // Get cache statistics
  getCacheStats() {
    return {
      size: this.embeddings.size,
      modelLoaded: !!this.extractor
    }
  }
}

// Create singleton instance
const semanticSearchEngine = new SemanticSearchEngine()

export default semanticSearchEngine
