import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Search as SearchIcon, BookOpen, ChevronRight, ExternalLink, Target, FileText, Brain, Zap, Type } from 'lucide-react'
import semanticSearchEngine from '../utils/semanticSearch'

const Search = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [bookData, setBookData] = useState({})
  const [searchMode, setSearchMode] = useState('hybrid') // 'semantic', 'keyword', 'hybrid'
  const [modelLoading, setModelLoading] = useState(false)
  const [modelLoaded, setModelLoaded] = useState(false)

  // Books configuration (same as ReadBook and Comparison)
  const books = {
    pmbok: {
      name: 'PMBOK Guide 7th Edition',
      file: 'pmbok_flat.json',
      description: 'A Guide to the Project Management Body of Knowledge',
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      pdfFile: 'PMBOK.pdf'
    },
    iso2020: {
      name: 'ISO 21502:2020',
      file: 'iso_2020_flat.json',
      description: 'Project, programme and portfolio management — Guidance on project management',
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      pdfFile: 'ISO1.pdf'
    },
    iso2021: {
      name: 'ISO 21500:2021',
      file: 'iso 2021.json',
      description: 'Project, programme and portfolio management — Context and concepts',
      color: 'text-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      pdfFile: 'ISO2.pdf'
    },
    prince2: {
      name: 'PRINCE2',
      file: 'pince2.json',
      description: 'PRojects IN Controlled Environments - Structured project management method',
      color: 'text-orange-700',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      pdfFile: 'PRINCE2.pdf'
    }
  }

  // Load book data
  const loadBook = async (bookKey) => {
    if (bookData[bookKey]) return bookData[bookKey]
    
    try {
      const response = await fetch(`/flattened_books/${books[bookKey].file}`)
      if (response.ok) {
        const data = await response.json()
        setBookData(prev => ({ ...prev, [bookKey]: data }))
        return data
      }
    } catch (error) {
      console.error('Error loading book:', error)
    }
    return null
  }

  // Load all books on component mount and initialize semantic search
  useEffect(() => {
    const loadAllBooks = async () => {
      await Promise.all(Object.keys(books).map(bookKey => loadBook(bookKey)))
    }
    
    const initializeSemanticSearch = async () => {
      try {
        setModelLoading(true)
        await semanticSearchEngine.initialize()
        setModelLoaded(true)
      } catch (error) {
        console.error('Failed to initialize semantic search:', error)
      } finally {
        setModelLoading(false)
      }
    }
    
    loadAllBooks()
    initializeSemanticSearch()
  }, [])

  // Filter out problematic records
  const filterValidRecords = (records) => {
    return records.filter(record => {
      if (record.topic && record.topic.toLowerCase().includes('unlabeled')) return false
      if (record.subtopic && record.subtopic.toLowerCase().includes('unlabeled')) return false
      if (!record.content || record.content.trim().length < 20) return false
      if (record.content && record.content.trim().length < 50 && 
          (record.content.trim().match(/^\w+$/) || record.content.trim().split(' ').length < 5)) {
        return false
      }
      return true
    })
  }

  // Get all records from a book
  const getBookRecords = (bookKey) => {
    const data = bookData[bookKey]
    if (!data) return []
    
    let records = []
    if (data.sections) {
      // Structure with sections (like iso_2020_flat.json)
      Object.values(data.sections).forEach(section => {
        records = [...records, ...(section.records || [])]
      })
    } else if (data.records) {
      // Flat structure (like pmbok_flat.json)
      records = data.records
    }
    
    return filterValidRecords(records)
  }

  // Enhanced search function with semantic capabilities
  const performSearch = async (query) => {
    if (!query.trim() || query.length < 2) {
      setSearchResults([])
      return
    }

    setLoading(true)
    let results = []

    try {
      // Collect all records from all books
      const allRecords = []
      for (const [bookKey, bookInfo] of Object.entries(books)) {
        const records = getBookRecords(bookKey)
        records.forEach(record => {
          allRecords.push({
            ...record,
            bookKey,
            bookName: bookInfo.name,
            bookColor: bookInfo.color,
            bookBgColor: bookInfo.bgColor
          })
        })
      }

      // Perform search based on selected mode
      if (searchMode === 'semantic' && modelLoaded) {
        const semanticResults = await semanticSearchEngine.semanticSearch(allRecords, query, {
          threshold: 0.3,
          maxResults: 15,
          segmentLength: 400,
          includeStructuralSearch: false
        })
        
        results = semanticResults.map(result => ({
          id: `${result.bookKey}-${result.topic}-${result.subtopic}-${result.subsubtopic}-semantic`,
          ...result,
          matchType: 'semantic',
          context: result.matchedSegment
        }))
        
      } else if (searchMode === 'hybrid' && modelLoaded) {
        const hybridResults = await semanticSearchEngine.hybridSearch(allRecords, query, {
          threshold: 0.25,
          maxResults: 15,
          semanticWeight: 0.7,
          keywordWeight: 0.3
        })
        
        results = hybridResults.map(result => ({
          id: `${result.bookKey}-${result.topic}-${result.subtopic}-${result.subsubtopic}-hybrid`,
          ...result,
          matchType: result.matchType,
          context: result.matchedSegment,
          relevanceScore: result.hybridScore * 100
        }))
        
      } else {
        // Fallback to keyword search or when model is not loaded
        const keywordResults = semanticSearchEngine.keywordSearch(allRecords, query, {
          threshold: 0.2,
          maxResults: 15
        })
        
        results = keywordResults.map(result => ({
          id: `${result.bookKey}-${result.topic}-${result.subtopic}-${result.subsubtopic}-keyword`,
          ...result,
          matchType: 'keyword',
          context: result.matchedSegment
        }))
      }

    } catch (error) {
      console.error('Search error:', error)
      // Fallback to basic search on error
      results = performBasicSearch(query)
    }

    setSearchResults(results)
    setLoading(false)
  }

  // Basic search fallback (original implementation)
  const performBasicSearch = (query) => {
    const results = []
    const searchTerm = query.toLowerCase()

    for (const [bookKey, bookInfo] of Object.entries(books)) {
      const records = getBookRecords(bookKey)
      
      // Structure matches
      const structureMatches = records.filter(record => {
        return (
          (record.topic && record.topic.toLowerCase().includes(searchTerm)) ||
          (record.subtopic && record.subtopic.toLowerCase().includes(searchTerm)) ||
          (record.subsubtopic && record.subsubtopic.toLowerCase().includes(searchTerm))
        )
      })

      structureMatches.forEach(record => {
        const matchType = record.topic?.toLowerCase().includes(searchTerm) ? 'topic' :
                         record.subtopic?.toLowerCase().includes(searchTerm) ? 'subtopic' : 'subsubtopic'
        
        results.push({
          id: `${bookKey}-${record.topic}-${record.subtopic}-${record.subsubtopic}-structure`,
          bookKey,
          bookName: bookInfo.name,
          bookColor: bookInfo.color,
          bookBgColor: bookInfo.bgColor,
          topic: record.topic,
          subtopic: record.subtopic,
          subsubtopic: record.subsubtopic,
          content: record.content,
          matchType: 'structure',
          matchLevel: matchType,
          relevanceScore: matchType === 'topic' ? 100 : matchType === 'subtopic' ? 90 : 80
        })
      })

      // Content matches (limited if many structure matches)
      if (structureMatches.length < 5) {
        const contentMatches = records.filter(record => {
          return record.content && record.content.toLowerCase().includes(searchTerm) &&
                 !structureMatches.some(sm => sm === record)
        })

        contentMatches.forEach(record => {
          const contentLower = record.content.toLowerCase()
          const matchIndex = contentLower.indexOf(searchTerm)
          const contextStart = Math.max(0, matchIndex - 100)
          const contextEnd = Math.min(record.content.length, matchIndex + searchTerm.length + 100)
          const context = record.content.substring(contextStart, contextEnd)
          
          results.push({
            id: `${bookKey}-${record.topic}-${record.subtopic}-${record.subsubtopic}-content`,
            bookKey,
            bookName: bookInfo.name,
            bookColor: bookInfo.color,
            bookBgColor: bookInfo.bgColor,
            topic: record.topic,
            subtopic: record.subtopic,
            subsubtopic: record.subsubtopic,
            content: record.content,
            context: context,
            matchType: 'content',
            relevanceScore: 50
          })
        })
      }
    }

    return results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0)).slice(0, 15)
  }

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      performSearch(searchQuery)
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, bookData])

  // Navigate to ReadBook with specific selection
  const navigateToResult = (result) => {
    const params = new URLSearchParams()
    params.set('book', result.bookKey)
    if (result.topic) params.set('topic', result.topic)
    if (result.subtopic) params.set('subtopic', result.subtopic)
    if (result.subsubtopic) params.set('subsubtopic', result.subsubtopic)
    
    navigate(`/read-book?${params.toString()}`)
  }

  // Highlight search term in text
  const highlightText = (text, searchTerm) => {
    if (!text || !searchTerm) return text
    
    const regex = new RegExp(`(${searchTerm})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? 
        <mark key={index} className="bg-yellow-200 px-1 rounded">{part}</mark> : 
        part
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 gradient-text">
            Search PM Standards
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Search across all project management standards and books. Find topics, subtopics, or specific content.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for topics, concepts, or specific content..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>
          
          {/* Search Mode Toggle */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-700">Search Mode:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setSearchMode('hybrid')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 flex items-center gap-1 ${
                    searchMode === 'hybrid'
                      ? 'bg-blue-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  disabled={!modelLoaded}
                >
                  <Zap className="h-3 w-3" />
                  Smart
                </button>
                <button
                  onClick={() => setSearchMode('semantic')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 flex items-center gap-1 ${
                    searchMode === 'semantic'
                      ? 'bg-purple-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                  disabled={!modelLoaded}
                >
                  <Brain className="h-3 w-3" />
                  Semantic
                </button>
                <button
                  onClick={() => setSearchMode('keyword')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-all duration-200 flex items-center gap-1 ${
                    searchMode === 'keyword'
                      ? 'bg-green-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  <Type className="h-3 w-3" />
                  Keyword
                </button>
              </div>
            </div>
            
            {/* Model Status */}
            <div className="flex items-center gap-2 text-xs">
              {modelLoading && (
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-blue-600 border-t-transparent"></div>
                  Loading AI Model...
                </div>
              )}
              {modelLoaded && !modelLoading && (
                <div className="flex items-center gap-1 text-green-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  AI Ready
                </div>
              )}
              {!modelLoaded && !modelLoading && (
                <div className="flex items-center gap-1 text-gray-500">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  Basic Search
                </div>
              )}
            </div>
          </div>
          
          {searchQuery && (
            <p className="text-sm text-gray-500 mt-2">
              {loading ? (
                <span className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-3 w-3 border-2 border-gray-400 border-t-transparent"></div>
                  Searching with {searchMode} mode...
                </span>
              ) : (
                `${searchResults.length} results found using ${searchMode} search`
              )}
            </p>
          )}
        </div>

        {/* Search Results */}
        <div className="space-y-4">
          {searchResults.map((result) => (
            <Card 
              key={result.id}
              className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02]"
              onClick={() => navigateToResult(result)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${result.bookBgColor}`}>
                      <BookOpen className={`h-4 w-4 ${result.bookColor}`} />
                    </div>
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <span className={result.bookColor}>{result.bookName}</span>
                        {result.matchType === 'semantic' && (
                          <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <Brain className="h-3 w-3" />
                            semantic ({Math.round(result.relevanceScore || result.semanticScore * 100)}%)
                          </span>
                        )}
                        {result.matchType === 'hybrid' && (
                          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            smart ({Math.round(result.relevanceScore)}%)
                          </span>
                        )}
                        {result.matchType === 'keyword' && (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                            <Type className="h-3 w-3" />
                            keyword
                          </span>
                        )}
                        {(result.matchType === 'structure' || result.matchType === 'content') && (
                          <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs font-medium">
                            {result.matchLevel || result.matchType} match
                          </span>
                        )}
                      </CardTitle>
                      <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                        {result.topic && (
                          <>
                            <span>{highlightText(result.topic, searchQuery)}</span>
                            {result.subtopic && (
                              <>
                                <ChevronRight className="h-3 w-3" />
                                <span>{highlightText(result.subtopic, searchQuery)}</span>
                              </>
                            )}
                            {result.subsubtopic && (
                              <>
                                <ChevronRight className="h-3 w-3" />
                                <span>{highlightText(result.subsubtopic, searchQuery)}</span>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    Open
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-gray-700 text-sm leading-relaxed">
                  {result.matchType === 'content' ? (
                    <div>
                      ...{highlightText(result.context, searchQuery)}...
                    </div>
                  ) : (
                    <div className="line-clamp-3">
                      {highlightText(result.content.substring(0, 200), searchQuery)}
                      {result.content.length > 200 && '...'}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {searchQuery && !loading && searchResults.length === 0 && (
          <div className="text-center py-12">
            <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No results found</h3>
            <p className="text-gray-600">
              Try searching with different keywords or check your spelling.
            </p>
          </div>
        )}

        {/* Search Tips */}
        {!searchQuery && (
          <div className="max-w-4xl mx-auto mt-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Search Modes & Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Zap className="h-4 w-4 text-blue-500" />
                      <h4 className="font-medium text-gray-900">Smart Search</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Combines AI semantic understanding with keyword matching for best results.
                    </p>
                    <div className="text-xs text-gray-500">
                      Example: "project risk assessment" finds related concepts like "uncertainty analysis"
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Brain className="h-4 w-4 text-purple-500" />
                      <h4 className="font-medium text-gray-900">Semantic Search</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      AI-powered search that understands meaning and context, not just exact words.
                    </p>
                    <div className="text-xs text-gray-500">
                      Example: "team leadership" also finds "managing people", "human resources"
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Type className="h-4 w-4 text-green-500" />
                      <h4 className="font-medium text-gray-900">Keyword Search</h4>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      Traditional search that looks for exact word matches in topics and content.
                    </p>
                    <div className="text-xs text-gray-500">
                      Example: "stakeholder" finds exact mentions of "stakeholder"
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-3">Search Examples</h4>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="font-medium text-gray-700 mb-1">Conceptual Queries</div>
                      <div className="text-gray-600 space-y-1">
                        <div>"managing project uncertainty"</div>
                        <div>"team collaboration strategies"</div>
                        <div>"quality assurance processes"</div>
                      </div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-700 mb-1">Specific Topics</div>
                      <div className="text-gray-600 space-y-1">
                        <div>"risk register", "work breakdown"</div>
                        <div>"change control", "lessons learned"</div>
                        <div>"project charter", "scope creep"</div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {!modelLoaded && !modelLoading && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-2 text-amber-800 text-sm">
                      <Brain className="h-4 w-4" />
                      <span className="font-medium">AI Model Loading</span>
                    </div>
                    <p className="text-amber-700 text-xs mt-1">
                      The semantic search model is loading in the background. Smart and Semantic modes will be available once ready.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default Search
