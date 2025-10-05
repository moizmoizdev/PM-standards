import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Lightbulb, TrendingUp, Zap, ChevronRight } from 'lucide-react'

const Insights = () => {
  const [insightsData, setInsightsData] = useState({
    similarities: '',
    differences: '',
    uniquePoints: ''
  })
  const [activeTab, setActiveTab] = useState('similarities')
  const [loading, setLoading] = useState(true)

  // Function to parse bold text {b}text{b} -> <strong>text</strong>
  const parseBoldText = (text) => {
    return text.replace(/\{b\}(.*?)\{b\}/g, '<strong>$1</strong>')
  }

  // Function to format text with line breaks and bold parsing
  const formatText = (text) => {
    const boldParsed = parseBoldText(text)
    return boldParsed.split('\n').map((line, index) => (
      <p key={index} className="mb-3" dangerouslySetInnerHTML={{ __html: line }} />
    ))
  }

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const [similarities, differences, uniquePoints] = await Promise.all([
          fetch('/Insights/Similarities.txt').then(res => res.text()),
          fetch('/Insights/Differences.txt').then(res => res.text()),
          fetch('/Insights/Unique Points.txt').then(res => res.text())
        ])

        setInsightsData({
          similarities,
          differences,
          uniquePoints
        })
      } catch (error) {
        console.error('Error fetching insights:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInsights()
  }, [])

  const tabs = [
    {
      id: 'similarities',
      title: 'Similarities',
      icon: TrendingUp,
      description: 'Common practices across standards',
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: 'differences',
      title: 'Differences',
      icon: Zap,
      description: 'Unique approaches and methodologies',
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      id: 'uniquePoints',
      title: 'Unique Points',
      icon: Lightbulb,
      description: 'Exclusive features of each standard',
      color: 'text-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ]

  const activeTabData = tabs.find(tab => tab.id === activeTab)

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Loading Insights...</h3>
          <p className="text-muted-foreground">Analyzing project management standards</p>
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
            Project Management <span className="text-primary">Insights</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-4">
            Deep analysis of similarities, differences, and unique aspects across PM standards
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 max-w-2xl mx-auto">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> Content may be derived or modified by AI for analysis purposes. 
              Based on comprehensive analysis of PM standards documentation.
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Card
                key={tab.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  activeTab === tab.id
                    ? `${tab.bgColor} ${tab.borderColor} border-2 shadow-md`
                    : 'hover:bg-muted/50'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${tab.bgColor}`}>
                        <Icon className={`h-6 w-6 ${tab.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{tab.title}</CardTitle>
                        <CardDescription className="text-sm">
                          {tab.description}
                        </CardDescription>
                      </div>
                    </div>
                    <ChevronRight className={`h-5 w-5 transition-transform ${
                      activeTab === tab.id ? 'rotate-90' : ''
                    } ${tab.color}`} />
                  </div>
                </CardHeader>
              </Card>
            )
          })}
        </div>

        {/* Content Display */}
        <Card className={`${activeTabData.bgColor} ${activeTabData.borderColor} border-2`}>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className={`p-3 rounded-lg bg-white`}>
                <activeTabData.icon className={`h-8 w-8 ${activeTabData.color}`} />
              </div>
              <div>
                <CardTitle className="text-2xl">{activeTabData.title}</CardTitle>
                <CardDescription className="text-lg">
                  {activeTabData.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-lg max-w-none">
              <div className="text-foreground leading-relaxed">
                {formatText(insightsData[activeTab])}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <TrendingUp className="h-12 w-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">15+</h3>
              <p className="text-muted-foreground">Common Practices</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Zap className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">25+</h3>
              <p className="text-muted-foreground">Key Differences</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Lightbulb className="h-12 w-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">30+</h3>
              <p className="text-muted-foreground">Unique Features</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Insights
