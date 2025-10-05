import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { GitCompare, BookOpen, Target, Users, TrendingUp, Eye, Book, ArrowLeftRight, ExternalLink } from 'lucide-react'

const Comparison = () => {
  const navigate = useNavigate()
  const [comparisonData, setComparisonData] = useState({})
  const [selectedTopic, setSelectedTopic] = useState('Communication Management')
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('detailed') // 'detailed' or 'heatmap'
  const [selectedCell, setSelectedCell] = useState(null)
  const [comparisonType, setComparisonType] = useState('standards') // 'standards' or 'books'
  
  // Cross-book comparison states
  const [bookData, setBookData] = useState({})
  const [selectedBook1, setSelectedBook1] = useState('pmbok')
  const [selectedBook2, setSelectedBook2] = useState('iso2020')
  const [selectedTopic1, setSelectedTopic1] = useState('')
  const [selectedSubtopic1, setSelectedSubtopic1] = useState('')
  const [selectedSubsubtopic1, setSelectedSubsubtopic1] = useState('')
  const [selectedTopic2, setSelectedTopic2] = useState('')
  const [selectedSubtopic2, setSelectedSubtopic2] = useState('')
  const [selectedSubsubtopic2, setSelectedSubsubtopic2] = useState('')
  const [bookComparison, setBookComparison] = useState({ content1: null, content2: null })

  // Refs for auto-scrolling
  const topicRef1 = useRef(null)
  const subtopicRef1 = useRef(null)
  const subsubtopicRef1 = useRef(null)
  const topicRef2 = useRef(null)
  const subtopicRef2 = useRef(null)
  const subsubtopicRef2 = useRef(null)

  // Auto-scroll function
  const scrollToElement = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      })
    }
  }

  // Deep linking function to navigate to ReadBook with selections
  const navigateToReadBook = (bookKey, topicName, subtopicName = null, subsubtopicName = null) => {
    // Create URL parameters for deep linking
    const params = new URLSearchParams()
    params.set('book', bookKey)
    if (topicName) params.set('topic', topicName)
    if (subtopicName) params.set('subtopic', subtopicName)
    if (subsubtopicName) params.set('subsubtopic', subsubtopicName)
    
    navigate(`/read-book?${params.toString()}`)
  }

  // Books configuration (same as ReadBook)
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

  // Available topics based on the public/Comparison folder structure
  const topics = [
    'Communication Management',
    'Organization Environment',
    'Project Life Cycles and Development Approaches',
    'Project Management Fundamentals',
    'Project Management Principles',
    'Quality management',
    'Risk Management',
    'Stakeholder Management',
    'Team Management'
  ]

  const standards = ['iso', 'pmi', 'prince2']

  // Helper functions for cross-book comparison
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

  const getBookTopics = (bookKey) => {
    const data = bookData[bookKey]
    if (!data) return []
    
    let records = []
    if (data.sections) {
      Object.values(data.sections).forEach(section => {
        records = [...records, ...(section.records || [])]
      })
    } else if (data.records) {
      records = data.records
    }
    
    records = filterValidRecords(records)
    return [...new Set(records.map(record => record.topic).filter(Boolean))]
  }

  const getBookSubtopics = (bookKey, topicName) => {
    const data = bookData[bookKey]
    if (!data) return []
    
    let records = []
    if (data.sections) {
      Object.values(data.sections).forEach(section => {
        records = [...records, ...(section.records || [])]
      })
    } else if (data.records) {
      records = data.records
    }
    
    records = filterValidRecords(records)
    const topicRecords = records.filter(r => r.topic === topicName)
    return [...new Set(topicRecords.map(record => record.subtopic).filter(Boolean))]
  }

  const getBookSubsubtopics = (bookKey, topicName, subtopicName) => {
    const data = bookData[bookKey]
    if (!data) return []
    
    let records = []
    if (data.sections) {
      Object.values(data.sections).forEach(section => {
        records = [...records, ...(section.records || [])]
      })
    } else if (data.records) {
      records = data.records
    }
    
    records = filterValidRecords(records)
    const subtopicRecords = records.filter(r => r.topic === topicName && r.subtopic === subtopicName)
    return [...new Set(subtopicRecords.map(record => record.subsubtopic).filter(Boolean))]
  }

  const getBookContent = (bookKey, topicName, subtopicName = null, subsubtopicName = null) => {
    const data = bookData[bookKey]
    if (!data) return []
    
    let records = []
    if (data.sections) {
      Object.values(data.sections).forEach(section => {
        records = [...records, ...(section.records || [])]
      })
    } else if (data.records) {
      records = data.records
    }
    
    records = filterValidRecords(records)
    
    if (subsubtopicName) {
      return records.filter(r => r.topic === topicName && r.subtopic === subtopicName && r.subsubtopic === subsubtopicName)
    } else if (subtopicName) {
      return records.filter(r => r.topic === topicName && r.subtopic === subtopicName && !r.subsubtopic)
    } else {
      return records.filter(r => r.topic === topicName && !r.subtopic)
    }
  }

  // Heatmap data - emphasis levels (1-5 scale) based on actual PDF content analysis
  const heatmapData = {
    'Communication Management': { iso: 3, pmi: 4, prince2: 4 },
    'Organization Environment': { iso: 4, pmi: 3, prince2: 3 },
    'Project Life Cycles and Development Approaches': { iso: 3, pmi: 5, prince2: 4 },
    'Project Management Fundamentals': { iso: 4, pmi: 4, prince2: 4 },
    'Project Management Principles': { iso: 4, pmi: 5, prince2: 5 },
    'Quality management': { iso: 4, pmi: 4, prince2: 4 },
    'Risk Management': { iso: 4, pmi: 5, prince2: 5 },
    'Stakeholder Management': { iso: 4, pmi: 5, prince2: 3 },
    'Team Management': { iso: 3, pmi: 4, prince2: 5 }
  }

  // Get heat intensity color
  const getHeatColor = (value) => {
    const colors = {
      1: 'bg-slate-100 text-slate-600 border-slate-200',
      2: 'bg-blue-100 text-blue-700 border-blue-200',
      3: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      4: 'bg-orange-100 text-orange-700 border-orange-200',
      5: 'bg-red-100 text-red-700 border-red-200'
    }
    return colors[value] || colors[1]
  }

  // Get heat intensity label
  const getHeatLabel = (value) => {
    const labels = {
      1: 'Minimal',
      2: 'Low',
      3: 'Medium',
      4: 'High',
      5: 'Very High'
    }
    return labels[value] || 'Unknown'
  }

  // Fu{b}{b}nction to parse bold text {b}text{b} -> <strong>text</strong>
  const parseBoldText = (text) => {
    return text.replace(/\{b\}(.*?)\{b\}/g, '<strong>$1</strong>')
  }

  // Function to format text with line breaks and bold parsing
  const formatText = (text) => {
    if (!text) return <p className="text-muted-foreground">No data available</p>
    
    const boldParsed = parseBoldText(text)
    const lines = boldParsed.split('\n').filter(line => line.trim() !== '')
    
    return (
      <div style={{ userSelect: 'text' }}>
        {lines.map((line, index) => {
          // Check if line has HTML (bold tags)
          if (line.includes('<strong>')) {
            return (
              <p 
                key={index} 
                className="mb-3" 
                dangerouslySetInnerHTML={{ __html: line }}
                style={{ userSelect: 'text' }}
              />
            )
          } else {
            return (
              <p 
                key={index} 
                className="mb-3"
                style={{ userSelect: 'text' }}
              >
                {line}
              </p>
            )
          }
        })}
      </div>
    )
  }

   useEffect(() => {
     const fetchComparisonData = async () => {
       if (comparisonType === 'standards') {
         // Load standards comparison data
         try {
           const data = {}
           
           for (const standard of standards) {
             try {
               const response = await fetch(`/Comparison/${selectedTopic}/${standard}.txt`)
               if (response.ok) {
                 data[standard] = await response.text()
               } else {
                 data[standard] = 'Data not available'
               }
             } catch (error) {
               console.error(`Error fetching ${standard} data:`, error)
               data[standard] = 'Error loading data'
             }
           }
           
           setComparisonData(data)
         } catch (error) {
           console.error('Error fetching comparison data:', error)
         } finally {
           setLoading(false)
         }
       } else if (comparisonType === 'books') {
         // Load book data for cross-book comparison
         try {
           await Promise.all([
             loadBook(selectedBook1),
             loadBook(selectedBook2)
           ])
         } catch (error) {
           console.error('Error loading book data:', error)
         } finally {
           setLoading(false)
         }
       }
     }

     setLoading(true)
     fetchComparisonData()
   }, [selectedTopic, comparisonType, selectedBook1, selectedBook2])

   // Update book comparison when selections change
   useEffect(() => {
     if (comparisonType === 'books' && selectedTopic1 && selectedTopic2) {
       const content1 = getBookContent(selectedBook1, selectedTopic1, selectedSubtopic1, selectedSubsubtopic1)
       const content2 = getBookContent(selectedBook2, selectedTopic2, selectedSubtopic2, selectedSubsubtopic2)
       
       setBookComparison({
         content1: content1.length > 0 ? content1 : null,
         content2: content2.length > 0 ? content2 : null
       })
     }
   }, [comparisonType, selectedBook1, selectedBook2, selectedTopic1, selectedTopic2, selectedSubtopic1, selectedSubtopic1, selectedSubsubtopic1, selectedSubsubtopic2])

   // Auto-scroll effects
   useEffect(() => {
     if (selectedBook1 && comparisonType === 'books') {
       setTimeout(() => scrollToElement(topicRef1), 300)
     }
   }, [selectedBook1, comparisonType])

   useEffect(() => {
     if (selectedTopic1 && comparisonType === 'books') {
       setTimeout(() => scrollToElement(subtopicRef1), 300)
     }
   }, [selectedTopic1, comparisonType])

   useEffect(() => {
     if (selectedSubtopic1 && comparisonType === 'books') {
       setTimeout(() => scrollToElement(subsubtopicRef1), 300)
     }
   }, [selectedSubtopic1, comparisonType])

   useEffect(() => {
     if (selectedBook2 && comparisonType === 'books') {
       setTimeout(() => scrollToElement(topicRef2), 300)
     }
   }, [selectedBook2, comparisonType])

   useEffect(() => {
     if (selectedTopic2 && comparisonType === 'books') {
       setTimeout(() => scrollToElement(subtopicRef2), 300)
     }
   }, [selectedTopic2, comparisonType])

   useEffect(() => {
     if (selectedSubtopic2 && comparisonType === 'books') {
       setTimeout(() => scrollToElement(subsubtopicRef2), 300)
     }
   }, [selectedSubtopic2, comparisonType])

  const standardsInfo = {
    iso: {
      name: 'ISO 21500/21502',
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      icon: Target
    },
    pmi: {
      name: 'PMI PMBOK 7th',
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: BookOpen
    },
    prince2: {
      name: 'PRINCE2',
      color: 'text-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      icon: Users
    }
  }

  const formatContent = (text) => {
    if (!text) return null
    
    const processedText = parseBoldText(text)
    const paragraphs = processedText.split('\n').filter(p => p.trim())
    
    return (
      <div className="space-y-4">
        {paragraphs.map((paragraph, index) => (
          <p 
            key={index} 
            className="text-foreground leading-relaxed select-text"
            dangerouslySetInnerHTML={{ __html: paragraph }}
            style={{ userSelect: 'text' }}
          />
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Loading Comparison...</h3>
          <p className="text-muted-foreground">Analyzing {selectedTopic}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            PM <span className="gradient-text">Comparison</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Compare PM standards or analyze content across different books
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 max-w-2xl mx-auto">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> Some content may be derived or modified by AI for analysis and comparison purposes. 
              Original source materials are available in the public folder.
            </p>
          </div>
        </div>

        {/* Comparison Type Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-muted rounded-lg p-1 flex">
            <Button
              variant={comparisonType === 'standards' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setComparisonType('standards')}
              className="rounded-md"
            >
              <Target className="h-4 w-4 mr-2" />
              Compare Across Standards
            </Button>
            <Button
              variant={comparisonType === 'books' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setComparisonType('books')}
              className="rounded-md"
            >
              <ArrowLeftRight className="h-4 w-4 mr-2" />
              Compare Across Books
            </Button>
          </div>
        </div>

        {/* View Mode Toggle - Only for standards comparison */}
        {comparisonType === 'standards' && (
          <div className="flex justify-center mb-8">
            <div className="bg-muted rounded-lg p-1 flex">
              <Button
                variant={viewMode === 'detailed' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('detailed')}
                className="rounded-md"
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Detailed View
              </Button>
              <Button
                variant={viewMode === 'heatmap' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('heatmap')}
                className="rounded-md"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                Heatmap View
              </Button>
            </div>
          </div>
        )}

        {/* Cross-Book Comparison Interface */}
        {comparisonType === 'books' && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Book 1 Selection */}
            <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  Book 1 Selection
            </CardTitle>
          </CardHeader>
              <CardContent className="space-y-4">
                {/* Book Selection */}
              <div>
                  <label className="block text-sm font-medium mb-2">Select Book</label>
                  <div className="grid gap-2">
                    {Object.entries(books).map(([key, book]) => (
                      <Card 
                        key={key}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
                          selectedBook1 === key 
                            ? `${book.borderColor} ${book.bgColor}` 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => {
                          setSelectedBook1(key)
                          setSelectedTopic1('')
                          setSelectedSubtopic1('')
                          setSelectedSubsubtopic1('')
                        }}
                      >
                        <CardContent className="p-3">
                          <div className={`font-medium ${selectedBook1 === key ? book.color : 'text-gray-700'}`}>
                            {book.name}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
              </div>

                {/* Topic Selection */}
                {selectedBook1 && (
                  <div ref={topicRef1}>
                    <label className="block text-sm font-medium mb-2">Select Topic</label>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {getBookTopics(selectedBook1).map(topic => (
                        <Card 
                          key={topic}
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
                            selectedTopic1 === topic 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => {
                            setSelectedTopic1(topic)
                            setSelectedSubtopic1('')
                            setSelectedSubsubtopic1('')
                          }}
                        >
                          <CardContent className="p-3">
                            <div className={`text-sm font-medium ${selectedTopic1 === topic ? 'text-blue-700' : 'text-gray-700'}`}>
                              {topic}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
              </div>
                )}

                {/* Subtopic Selection */}
                {selectedTopic1 && getBookSubtopics(selectedBook1, selectedTopic1).length > 0 && (
                  <div ref={subtopicRef1}>
                    <label className="block text-sm font-medium mb-2">Select Subtopic (Optional)</label>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      <Card 
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
                          selectedSubtopic1 === '' 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => {
                          setSelectedSubtopic1('')
                          setSelectedSubsubtopic1('')
                        }}
                      >
                        <CardContent className="p-2">
                          <div className={`text-xs font-medium ${selectedSubtopic1 === '' ? 'text-green-700' : 'text-gray-600'}`}>
                            Topic level content
                          </div>
                        </CardContent>
                      </Card>
                      {getBookSubtopics(selectedBook1, selectedTopic1).map(subtopic => (
                        <Card 
                          key={subtopic}
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
                            selectedSubtopic1 === subtopic 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => {
                            setSelectedSubtopic1(subtopic)
                            setSelectedSubsubtopic1('')
                          }}
                        >
                          <CardContent className="p-2">
                            <div className={`text-xs font-medium ${selectedSubtopic1 === subtopic ? 'text-green-700' : 'text-gray-600'}`}>
                              {subtopic}
                            </div>
                          </CardContent>
                        </Card>
                      ))}
              </div>
            </div>
                )}

                {/* Sub-subtopic Selection */}
                {selectedTopic1 && selectedSubtopic1 && getBookSubsubtopics(selectedBook1, selectedTopic1, selectedSubtopic1).length > 0 && (
                  <div ref={subsubtopicRef1}>
                    <label className="block text-sm font-medium mb-2">Select Sub-subtopic (Optional)</label>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      <Card 
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
                          selectedSubsubtopic1 === '' 
                            ? 'border-purple-500 bg-purple-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedSubsubtopic1('')}
                      >
                        <CardContent className="p-2">
                          <div className={`text-xs font-medium ${selectedSubsubtopic1 === '' ? 'text-purple-700' : 'text-gray-600'}`}>
                            Subtopic level content
                          </div>
          </CardContent>
        </Card>
                      {getBookSubsubtopics(selectedBook1, selectedTopic1, selectedSubtopic1).map(subsubtopic => (
                        <Card 
                          key={subsubtopic}
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
                            selectedSubsubtopic1 === subsubtopic 
                              ? 'border-purple-500 bg-purple-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedSubsubtopic1(subsubtopic)}
                        >
                          <CardContent className="p-2">
                            <div className={`text-xs font-medium ${selectedSubsubtopic1 === subsubtopic ? 'text-purple-700' : 'text-gray-600'}`}>
                              {subsubtopic}
                            </div>
            </CardContent>
          </Card>
                      ))}
                    </div>
                  </div>
                )}
            </CardContent>
          </Card>

            {/* Book 2 Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Book className="h-5 w-5" />
                  Book 2 Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Book Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Select Book</label>
                  <div className="grid gap-2">
                    {Object.entries(books).map(([key, book]) => (
                      <Card 
                        key={key}
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md border-2 ${
                          selectedBook2 === key 
                            ? `${book.borderColor} ${book.bgColor}` 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => {
                          setSelectedBook2(key)
                          setSelectedTopic2('')
                          setSelectedSubtopic2('')
                          setSelectedSubsubtopic2('')
                        }}
                      >
                        <CardContent className="p-3">
                          <div className={`font-medium ${selectedBook2 === key ? book.color : 'text-gray-700'}`}>
                            {book.name}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Topic Selection */}
                {selectedBook2 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Topic</label>
                    <div className="max-h-48 overflow-y-auto space-y-2">
                      {getBookTopics(selectedBook2).map(topic => (
                        <Card 
                          key={topic}
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
                            selectedTopic2 === topic 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => {
                            setSelectedTopic2(topic)
                            setSelectedSubtopic2('')
                            setSelectedSubsubtopic2('')
                          }}
                        >
                          <CardContent className="p-3">
                            <div className={`text-sm font-medium ${selectedTopic2 === topic ? 'text-blue-700' : 'text-gray-700'}`}>
                              {topic}
              </div>
            </CardContent>
          </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Subtopic Selection */}
                {selectedTopic2 && getBookSubtopics(selectedBook2, selectedTopic2).length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Subtopic (Optional)</label>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      <Card 
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
                          selectedSubtopic2 === '' 
                            ? 'border-green-500 bg-green-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => {
                          setSelectedSubtopic2('')
                          setSelectedSubsubtopic2('')
                        }}
                      >
                        <CardContent className="p-2">
                          <div className={`text-xs font-medium ${selectedSubtopic2 === '' ? 'text-green-700' : 'text-gray-600'}`}>
                            Topic level content
                          </div>
          </CardContent>
        </Card>
                      {getBookSubtopics(selectedBook2, selectedTopic2).map(subtopic => (
                        <Card 
                          key={subtopic}
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
                            selectedSubtopic2 === subtopic 
                              ? 'border-green-500 bg-green-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => {
                            setSelectedSubtopic2(subtopic)
                            setSelectedSubsubtopic2('')
                          }}
                        >
                          <CardContent className="p-2">
                            <div className={`text-xs font-medium ${selectedSubtopic2 === subtopic ? 'text-green-700' : 'text-gray-600'}`}>
                              {subtopic}
                      </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sub-subtopic Selection */}
                {selectedTopic2 && selectedSubtopic2 && getBookSubsubtopics(selectedBook2, selectedTopic2, selectedSubtopic2).length > 0 && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Select Sub-subtopic (Optional)</label>
                    <div className="max-h-32 overflow-y-auto space-y-1">
                      <Card 
                        className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
                          selectedSubsubtopic2 === '' 
                            ? 'border-purple-500 bg-purple-50' 
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                        onClick={() => setSelectedSubsubtopic2('')}
                      >
                        <CardContent className="p-2">
                          <div className={`text-xs font-medium ${selectedSubsubtopic2 === '' ? 'text-purple-700' : 'text-gray-600'}`}>
                            Subtopic level content
                          </div>
                        </CardContent>
                      </Card>
                      {getBookSubsubtopics(selectedBook2, selectedTopic2, selectedSubtopic2).map(subsubtopic => (
                        <Card 
                          key={subsubtopic}
                          className={`cursor-pointer transition-all duration-200 hover:shadow-md border ${
                            selectedSubsubtopic2 === subsubtopic 
                              ? 'border-purple-500 bg-purple-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => setSelectedSubsubtopic2(subsubtopic)}
                        >
                          <CardContent className="p-2">
                            <div className={`text-xs font-medium ${selectedSubsubtopic2 === subsubtopic ? 'text-purple-700' : 'text-gray-600'}`}>
                              {subsubtopic}
                      </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Cross-Book Comparison Results */}
        {comparisonType === 'books' && bookComparison.content1 && bookComparison.content2 && (
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className={`flex items-center justify-between ${books[selectedBook1].color}`}>
                  <div className="flex items-center gap-2">
                    <Book className="h-5 w-5" />
                    {books[selectedBook1].name}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigateToReadBook(selectedBook1, selectedTopic1, selectedSubtopic1, selectedSubsubtopic1)}
                    className="flex items-center gap-1 text-xs"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Go to Reference
                  </Button>
                </CardTitle>
                <CardDescription>
                  {selectedTopic1}
                  {selectedSubtopic1 && ` > ${selectedSubtopic1}`}
                  {selectedSubsubtopic1 && ` > ${selectedSubsubtopic1}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 overflow-y-scroll text-foreground leading-relaxed p-4 bg-white/50 rounded border">
                  {bookComparison.content1.map((record, index) => (
                    <div key={index} className="mb-6">
                      {formatContent(record.content)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className={`flex items-center justify-between ${books[selectedBook2].color}`}>
                  <div className="flex items-center gap-2">
                    <Book className="h-5 w-5" />
                    {books[selectedBook2].name}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigateToReadBook(selectedBook2, selectedTopic2, selectedSubtopic2, selectedSubsubtopic2)}
                    className="flex items-center gap-1 text-xs"
                  >
                    <ExternalLink className="h-3 w-3" />
                    Go to Reference
                  </Button>
                </CardTitle>
                <CardDescription>
                  {selectedTopic2}
                  {selectedSubtopic2 && ` > ${selectedSubtopic2}`}
                  {selectedSubsubtopic2 && ` > ${selectedSubsubtopic2}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96 overflow-y-scroll text-foreground leading-relaxed p-4 bg-white/50 rounded border">
                  {bookComparison.content2.map((record, index) => (
                    <div key={index} className="mb-6">
                      {formatContent(record.content)}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Standards Comparison - Only show when standards mode is selected */}
        {comparisonType === 'standards' && (
          <>
        {/* Topic Selection - Only show in detailed view */}
        {viewMode === 'detailed' && (
        <Card className="mb-8">
            <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitCompare className="h-5 w-5" />
                Select Topic to Compare
              </CardTitle>
              <CardDescription>
                Choose a project management topic to see how each standard approaches it
              </CardDescription>
            </CardHeader>
            <CardContent>
                <select
                  value={selectedTopic}
                  onChange={(e) => setSelectedTopic(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                {topics.map(topic => (
                  <option key={topic} value={topic}>
                    {topic}
                    </option>
                  ))}
                </select>
            </CardContent>
          </Card>
        )}

        {/* Heatmap View */}
        {viewMode === 'heatmap' && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Comparison Matrix Heatmap
              </CardTitle>
              <CardDescription>
                Visual comparison of coverage and emphasis across all PM topics. Click any cell for detailed comparison.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Legend */}
              <div className="mb-6">
                <h4 className="font-semibold text-foreground mb-3">Emphasis Level:</h4>
                <div className="flex flex-wrap gap-2">
                  {[1, 2, 3, 4, 5].map(level => (
                    <div key={level} className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded border ${getHeatColor(level)}`}></div>
                      <span className="text-sm text-muted-foreground">{getHeatLabel(level)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Heatmap Table */}
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left p-3 font-semibold text-foreground border-b">Topic</th>
                      <th className="text-center p-3 font-semibold text-blue-700 border-b">ISO 21500/21502</th>
                      <th className="text-center p-3 font-semibold text-green-700 border-b">PMI PMBOK 7th</th>
                      <th className="text-center p-3 font-semibold text-purple-700 border-b">PRINCE2</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topics.map((topic, index) => (
                      <tr key={topic} className={index % 2 === 0 ? 'bg-muted/20' : ''}>
                        <td className="p-3 font-medium text-foreground border-b text-sm">
                          {topic}
                        </td>
                        {standards.map(standard => {
                          const value = heatmapData[topic][standard]
                          const standardInfo = standardsInfo[standard]
                          return (
                            <td key={standard} className="p-2 border-b">
                              <div
                                className={`w-full h-12 rounded border-2 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md flex items-center justify-center font-semibold text-sm ${getHeatColor(value)} ${
                                  selectedCell === `${topic}-${standard}` ? 'ring-2 ring-primary' : ''
                                }`}
                                onClick={() => {
                                  setSelectedCell(`${topic}-${standard}`)
                                  setSelectedTopic(topic)
                                  setViewMode('detailed')
                                }}
                                title={`${standardInfo.name}: ${getHeatLabel(value)} emphasis on ${topic}`}
                              >
                                {value}
                              </div>
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Heatmap Insights */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold text-blue-800">ISO Strengths</h4>
                    </div>
                    <p className="text-sm text-blue-700">Strong in organizational environment and stakeholder engagement. Provides comprehensive guidance framework with balanced coverage across all areas.</p>
                  </CardContent>
                </Card>
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <BookOpen className="h-5 w-5 text-green-600" />
                      <h4 className="font-semibold text-green-800">PMI Strengths</h4>
                    </div>
                    <p className="text-sm text-green-700">Exceptional in principles (12 detailed principles), risk management, stakeholder engagement, and life cycle approaches. Most comprehensive coverage.</p>
                  </CardContent>
                </Card>
                <Card className="bg-purple-50 border-purple-200">
                  <CardContent className="pt-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      <h4 className="font-semibold text-purple-800">PRINCE2 Strengths</h4>
                </div>
                    <p className="text-sm text-purple-700">Outstanding in team management with dedicated "People" focus, risk control with 5-step process, and 7 core principles. Process-driven excellence.</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Comparison Grid - Only show in detailed view */}
        {viewMode === 'detailed' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {standards.map((standard) => {
              const info = standardsInfo[standard]
              const Icon = info.icon
              
              return (
                 <Card key={standard} className={`${info.bgColor} ${info.borderColor} border-2 card-hover-effect`}>
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-lg bg-white transition-transform duration-200 hover:scale-110">
                        <Icon className={`h-6 w-6 ${info.color}`} />
                      </div>
              <div>
                        <CardTitle className="text-xl">{info.name}</CardTitle>
                        <CardDescription>
                          {selectedTopic}
                        </CardDescription>
              </div>
            </div>
                  </CardHeader>
                   <CardContent>
                     <div 
                       className="h-96 overflow-y-scroll text-foreground leading-relaxed p-4 bg-white/50 rounded border"
                       style={{ 
                         scrollbarWidth: 'thin',
                         userSelect: 'text',
                         WebkitUserSelect: 'text',
                         MozUserSelect: 'text',
                         msUserSelect: 'text'
                       }}
                     >
                       {formatText(comparisonData[standard])}
            </div>
          </CardContent>
        </Card>
              )
            })}
          </div>
        )}
        </>
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <Target className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">3</h3>
              <p className="text-muted-foreground">PM Standards</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <BookOpen className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">{topics.length}</h3>
              <p className="text-muted-foreground">Topics Available</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <GitCompare className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">100%</h3>
              <p className="text-muted-foreground">Coverage</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Comparison
