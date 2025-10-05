import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { BookOpen, ArrowLeft, ChevronRight, Home } from 'lucide-react'

const ReadBook = () => {
  const [searchParams] = useSearchParams()
  const [selectedBook, setSelectedBook] = useState(null)
  const [selectedSection, setSelectedSection] = useState(null)
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [selectedSubtopic, setSelectedSubtopic] = useState(null)
  const [selectedSubsubtopic, setSelectedSubsubtopic] = useState(null)
  const [bookData, setBookData] = useState({})
  const [loading, setLoading] = useState(false)

  const books = {
    pmbok: {
      name: 'PMBOK Guide 7th Edition',
      file: 'pmbok_flat.json',
      description: 'A Guide to the Project Management Body of Knowledge',
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    iso2020: {
      name: 'ISO 21502:2020',
      file: 'iso_2020_flat.json',
      description: 'Project, programme and portfolio management — Guidance on project management',
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    iso2021: {
      name: 'ISO 21500:2021',
      file: 'iso 2021.json',
      description: 'Project, programme and portfolio management — Context and concepts',
      color: 'text-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  }

  // Load book data
  const loadBook = async (bookKey) => {
    if (bookData[bookKey]) return // Already loaded
    
    setLoading(true)
    try {
      const response = await fetch(`/flattened_books/${books[bookKey].file}`)
      if (response.ok) {
        const data = await response.json()
        setBookData(prev => ({ ...prev, [bookKey]: data }))
      } else {
        console.error('Failed to load book:', bookKey, 'status:', response.status)
      }
    } catch (error) {
      console.error('Error loading book:', error)
    }
    setLoading(false)
  }

  // Get sections for selected book
  const getSections = (bookKey) => {
    const data = bookData[bookKey]
    if (!data) return []
    
    // Handle different JSON structures
    if (data.sections) {
      // Structure with sections (like iso_2020_flat.json)
      return Object.keys(data.sections).map(key => ({
        key,
        name: data.sections[key].name,
        recordCount: data.sections[key].records?.length || 0
      }))
    } else if (data.records) {
      // Flat structure (like pmbok_flat.json) - skip sections, go directly to topics
      return []
    }
    return []
  }

  // Filter out problematic records
  const filterValidRecords = (records) => {
    return records.filter(record => {
      // Skip records with "unlabeled" in topic, subtopic, or section
      if (record.topic && record.topic.toLowerCase().includes('unlabeled')) return false
      if (record.subtopic && record.subtopic.toLowerCase().includes('unlabeled')) return false
      
      // Skip records with very short or incomplete content
      if (!record.content || record.content.trim().length < 20) return false
      
      // Skip records that look like incomplete data (e.g., name: "2.3.1", content: "through")
      if (record.content && record.content.trim().length < 50 && 
          (record.content.trim().match(/^\w+$/) || record.content.trim().split(' ').length < 5)) {
        return false
      }
      
      return true
    })
  }

  // Get topics for selected section
  const getTopics = (bookKey, sectionKey = null) => {
    const data = bookData[bookKey]
    if (!data) return []
    
    let records = []
    
    // Handle different JSON structures
    if (data.sections && sectionKey && data.sections[sectionKey]) {
      // Structure with sections (like iso_2020_flat.json)
      records = data.sections[sectionKey].records || []
    } else if (data.records && !sectionKey) {
      // Flat structure (like pmbok_flat.json) - no sections, direct access to records
      records = data.records
    }
    
    // Filter out problematic records
    records = filterValidRecords(records)
    
    const topics = [...new Set(records.map(record => record.topic).filter(Boolean))]
    
    return topics.map(topic => ({
      name: topic,
      recordCount: records.filter(r => r.topic === topic).length
    }))
  }

  // Get subtopics for selected topic
  const getSubtopics = (bookKey, sectionKey, topicName) => {
    const data = bookData[bookKey]
    if (!data) return []
    
    let records = []
    
    // Handle different JSON structures
    if (data.sections && sectionKey && data.sections[sectionKey]) {
      // Structure with sections (like iso_2020_flat.json)
      records = data.sections[sectionKey].records || []
    } else if (data.records && !sectionKey) {
      // Flat structure (like pmbok_flat.json) - no sections, direct access to records
      records = data.records
    }
    
    // Filter out problematic records
    records = filterValidRecords(records)
    
    const topicRecords = records.filter(r => r.topic === topicName)
    const subtopics = [...new Set(topicRecords.map(record => record.subtopic).filter(Boolean))]
    
    return subtopics.map(subtopic => ({
      name: subtopic,
      recordCount: topicRecords.filter(r => r.subtopic === subtopic).length
    }))
  }

  // Get content for selected level
  const getContent = (bookKey, sectionKey, topicName, subtopicName = null) => {
    const data = bookData[bookKey]
    if (!data) return []
    
    let records = []
    
    // Handle different JSON structures
    if (data.sections && sectionKey && data.sections[sectionKey]) {
      // Structure with sections (like iso_2020_flat.json)
      records = data.sections[sectionKey].records || []
    } else if (data.records && !sectionKey) {
      // Flat structure (like pmbok_flat.json) - no sections, direct access to records
      records = data.records
    }
    
    // Filter out problematic records
    records = filterValidRecords(records)
    
    if (subtopicName) {
      return records.filter(r => r.topic === topicName && r.subtopic === subtopicName)
    } else {
      return records.filter(r => r.topic === topicName && !r.subtopic)
    }
  }

  // Get sub-subtopics for selected subtopic
  const getSubsubtopics = (bookKey, sectionKey, topicName, subtopicName) => {
    const data = bookData[bookKey]
    if (!data) return []
    
    let records = []
    
    // Handle different JSON structures
    if (data.sections && sectionKey && data.sections[sectionKey]) {
      records = data.sections[sectionKey].records || []
    } else if (data.records && !sectionKey) {
      // Flat structure (like pmbok_flat.json) - no sections, direct access to records
      records = data.records
    }
    
    // Filter out problematic records
    records = filterValidRecords(records)
    
    const subtopicRecords = records.filter(r => r.topic === topicName && r.subtopic === subtopicName)
    const subsubtopics = [...new Set(subtopicRecords.map(record => record.subsubtopic).filter(Boolean))]
    
    return subsubtopics.map(subsubtopic => ({
      name: subsubtopic,
      recordCount: subtopicRecords.filter(r => r.subsubtopic === subsubtopic).length
    }))
  }

  // Parse bold text
  const parseBoldText = (text) => {
    if (!text) return text
    return text.replace(/\{b\}(.*?)\{b\}/g, '<strong>$1</strong>')
  }

  // Handle deep linking from URL parameters
  useEffect(() => {
    const bookParam = searchParams.get('book')
    const topicParam = searchParams.get('topic')
    const subtopicParam = searchParams.get('subtopic')
    const subsubtopicParam = searchParams.get('subsubtopic')

    if (bookParam && books[bookParam]) {
      // Set book and load its data
      setSelectedBook(bookParam)
      loadBook(bookParam).then(() => {
        // Set section (for sectioned books) or skip for flat books
        const sections = getSections(bookParam)
        if (sections.length > 0) {
          setSelectedSection(sections[0].key) // Auto-select first section for sectioned books
        }
        
        // Set topic if provided
        if (topicParam) {
          setTimeout(() => {
            setSelectedTopic(topicParam)
            
            // Set subtopic if provided
            if (subtopicParam) {
              setTimeout(() => {
                setSelectedSubtopic(subtopicParam)
                
                // Set sub-subtopic if provided
                if (subsubtopicParam) {
                  setTimeout(() => {
                    setSelectedSubsubtopic(subsubtopicParam)
                  }, 100)
                }
              }, 100)
            }
          }, 100)
        }
      })
    }
  }, [searchParams])

  // Format content with bold parsing
  const formatContent = (content) => {
    if (!content) return <p className="text-gray-500">No content available</p>
    
    const boldParsed = parseBoldText(content)
    const lines = boldParsed.split('\n').filter(line => line.trim() !== '')
    
    return (
      <div className="space-y-3">
        {lines.map((line, index) => {
          if (line.includes('<strong>')) {
            return (
              <p 
                key={index} 
                className="leading-relaxed"
                dangerouslySetInnerHTML={{ __html: line }}
              />
            )
          } else {
            return (
              <p key={index} className="leading-relaxed">
                {line}
              </p>
            )
          }
        })}
      </div>
    )
  }

  // Reset navigation when going back
  const goHome = () => {
    setSelectedBook(null)
    setSelectedSection(null)
    setSelectedTopic(null)
    setSelectedSubtopic(null)
    setSelectedSubsubtopic(null)
  }

  const goBack = () => {
    if (selectedSubsubtopic) {
      setSelectedSubsubtopic(null)
    } else if (selectedSubtopic) {
      setSelectedSubtopic(null)
    } else if (selectedTopic) {
      setSelectedTopic(null)
    } else if (selectedSection) {
      setSelectedSection(null)
    } else if (selectedBook) {
      setSelectedBook(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 gradient-text">
            Read Books
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Access and read through the complete project management standards with structured navigation.
          </p>
        </div>

        {/* Breadcrumb Navigation */}
        {(selectedBook || selectedSection || selectedTopic || selectedSubtopic || selectedSubsubtopic) && (
          <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
            <Button variant="ghost" size="sm" onClick={goHome} className="flex items-center gap-1">
              <Home className="w-4 h-4" />
              Books
            </Button>
            {selectedBook && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="font-medium">{books[selectedBook].name}</span>
              </>
            )}
            {selectedSection && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span>{selectedSection}</span>
              </>
            )}
            {selectedTopic && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span>{selectedTopic}</span>
              </>
            )}
            {selectedSubtopic && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span>{selectedSubtopic}</span>
              </>
            )}
            {selectedSubsubtopic && (
              <>
                <ChevronRight className="w-4 h-4" />
                <span className="font-medium">{selectedSubsubtopic}</span>
              </>
            )}
          </div>
        )}

        {/* Back Button */}
        {(selectedBook || selectedSection || selectedTopic || selectedSubtopic || selectedSubsubtopic) && (
          <Button variant="outline" onClick={goBack} className="mb-6 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading book content...</p>
          </div>
        )}

        {/* Book Selection */}
        {!selectedBook && (
          <div className="grid md:grid-cols-2 gap-6">
            {Object.entries(books).map(([key, book]) => (
              <Card 
                key={key} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 ${book.borderColor} border-2`}
                onClick={() => {
                  setSelectedBook(key)
                  loadBook(key)
                }}
              >
                <CardHeader className={book.bgColor}>
                  <CardTitle className={`flex items-center gap-3 ${book.color}`}>
                    <BookOpen className="w-6 h-6" />
                    {book.name}
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    {book.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <Button className="w-full">
                    Read Book
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Section Selection - only for books with sections */}
        {selectedBook && !selectedSection && getSections(selectedBook).length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Sections in {books[selectedBook].name}
            </h2>
            <div className="grid gap-4">
              {getSections(selectedBook).map((section) => (
                <Card 
                  key={section.key}
                  className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-102"
                  onClick={() => setSelectedSection(section.key)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{section.name}</span>
                      <span className="text-sm text-gray-500 font-normal">
                        {section.recordCount} records
                      </span>
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Topic Selection - for books without sections OR after section selection */}
        {selectedBook && !selectedTopic && (getSections(selectedBook).length === 0 || selectedSection) && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Topics in {books[selectedBook].name}
              {selectedSection && ` - ${getSections(selectedBook).find(s => s.key === selectedSection)?.name}`}
            </h2>
            <div className="grid gap-4">
              {getTopics(selectedBook, selectedSection).map((topic) => (
                <Card 
                  key={topic.name}
                  className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-102"
                  onClick={() => setSelectedTopic(topic.name)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{topic.name}</span>
                      <span className="text-sm text-gray-500 font-normal">
                        {topic.recordCount} records
                      </span>
                    </CardTitle>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Subtopic Selection or Content Display */}
        {selectedBook && selectedTopic && (getSections(selectedBook).length === 0 || selectedSection) && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedTopic}
            </h2>

            {/* Show main topic content at the top if subtopics exist */}
            {!selectedSubtopic && getSubtopics(selectedBook, selectedSection, selectedTopic).length > 0 && getContent(selectedBook, selectedSection, selectedTopic).length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="prose max-w-none">
                    {getContent(selectedBook, selectedSection, selectedTopic).map((record, index) => (
                      <div key={index} className="mb-6">
                        {formatContent(record.content)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Show subtopics if they exist */}
            {!selectedSubtopic && getSubtopics(selectedBook, selectedSection, selectedTopic).length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-700">Subtopics</h3>
                <div className="grid gap-4">
                  {getSubtopics(selectedBook, selectedSection, selectedTopic).map((subtopic) => (
                    <Card 
                      key={subtopic.name}
                      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-102"
                      onClick={() => setSelectedSubtopic(subtopic.name)}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span>{subtopic.name}</span>
                          <span className="text-sm text-gray-500 font-normal">
                            {subtopic.recordCount} records
                          </span>
                        </CardTitle>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Show main topic content if no subtopics exist */}
            {!selectedSubtopic && getSubtopics(selectedBook, selectedSection, selectedTopic).length === 0 && getContent(selectedBook, selectedSection, selectedTopic).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Content</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    {getContent(selectedBook, selectedSection, selectedTopic).map((record, index) => (
                      <div key={index} className="mb-6">
                        {formatContent(record.content)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Show subtopic content */}
            {selectedSubtopic && !selectedSubsubtopic && (
              <div className="space-y-6">
                {/* Show subtopic intro content (content without subsubtopic) */}
                {getContent(selectedBook, selectedSection, selectedTopic, selectedSubtopic).filter(r => !r.subsubtopic).length > 0 && (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="prose max-w-none">
                        {getContent(selectedBook, selectedSection, selectedTopic, selectedSubtopic).filter(r => !r.subsubtopic).map((record, index) => (
                          <div key={index} className="mb-6">
                            {formatContent(record.content)}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Show sub-subtopics if they exist */}
                {getSubsubtopics(selectedBook, selectedSection, selectedTopic, selectedSubtopic).length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-700">Sub-subtopics</h3>
                    <div className="grid gap-4">
                      {getSubsubtopics(selectedBook, selectedSection, selectedTopic, selectedSubtopic).map((subsubtopic) => (
                        <Card 
                          key={subsubtopic.name}
                          className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-102"
                          onClick={() => setSelectedSubsubtopic(subsubtopic.name)}
                        >
                          <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                              <span>{subsubtopic.name}</span>
                              <span className="text-sm text-gray-500 font-normal">
                                {subsubtopic.recordCount} records
                              </span>
                            </CardTitle>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Show sub-subtopic content */}
            {selectedSubsubtopic && (
              <Card>
                <CardHeader>
                  <CardTitle>{selectedSubsubtopic}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose max-w-none">
                    {getContent(selectedBook, selectedSection, selectedTopic, selectedSubtopic).filter(r => r.subsubtopic === selectedSubsubtopic).map((record, index) => (
                      <div key={index} className="mb-6">
                        {formatContent(record.content)}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ReadBook
