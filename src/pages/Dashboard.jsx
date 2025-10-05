import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Lightbulb, GitCompare, BookOpen, ArrowRight, BarChart3, Target, Users, Search } from 'lucide-react'

const Dashboard = ({ onNavigate }) => {
  const dashboardOptions = [
    {
      id: 'search',
      title: 'Search',
      description: 'Search across all PM standards and books for specific topics or content',
      icon: Search,
      color: 'text-orange-700',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      features: ['Smart Search', 'All Books', 'Quick Results']
    },
    {
      id: 'insights',
      title: 'Insights',
      description: 'Discover similarities, differences, and unique aspects across PM standards',
      icon: Lightbulb,
      color: 'text-purple-700',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
      features: ['Common Practices', 'Key Differences', 'Unique Features']
    },
    {
      id: 'comparison',
      title: 'Comparison',
      description: 'Compare how different standards approach specific project management topics',
      icon: GitCompare,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      features: ['Side-by-side Analysis', '9 Topic Areas', '3 Standards']
    },
    {
      id: 'read-book',
      title: 'Read Book',
      description: 'Access and read through the complete project management standards',
      icon: BookOpen,
      color: 'text-green-700',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      features: ['Full Standards', 'Topic Navigation', 'Structured Content'],
      disabled: false
    }
  ]

  const stats = [
    {
      icon: Target,
      value: '3',
      label: 'PM Standards',
      color: 'text-blue-600'
    },
    {
      icon: BarChart3,
      value: '3',
      label: 'Books',
      color: 'text-green-600'
    },
    {
      icon: Users,
      value: '9',
      label: 'Topic Areas',
      color: 'text-purple-600'
    }
  ]

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            PM Standards <span className="gradient-text">Dashboard</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore project management standards through insights, comparisons, and comprehensive analysis
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="text-center hover-glow">
                <CardContent className="pt-6">
                  <Icon className={`h-12 w-12 ${stat.color} mx-auto mb-4 transition-transform duration-300 hover:scale-110`} />
                  <h3 className="text-3xl font-bold text-foreground mb-2">{stat.value}</h3>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Dashboard Options */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {dashboardOptions.map((option) => {
            const Icon = option.icon
            return (
              <Card 
                key={option.id} 
                className={`${option.bgColor} ${option.borderColor} border-2 transition-all duration-200 hover:shadow-lg card-hover-effect ${
                  option.disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
                }`}
                onClick={() => !option.disabled && onNavigate(option.id)}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 rounded-lg bg-white group-hover:scale-110 transition-transform duration-300">
                        <Icon className={`h-8 w-8 ${option.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-2xl">{option.title}</CardTitle>
                        {option.disabled && (
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                            Coming Soon
                          </span>
                        )}
                      </div>
                    </div>
                    {!option.disabled && (
                      <ArrowRight className={`h-6 w-6 ${option.color} transition-transform group-hover:translate-x-1`} />
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base mb-4">
                    {option.description}
                  </CardDescription>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground mb-2">Features:</h4>
                    <ul className="space-y-1">
                      {option.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className={`w-2 h-2 rounded-full ${option.color.replace('text-', 'bg-')}`} />
                          <span className="text-sm text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {!option.disabled && (
                    <Button 
                      className="w-full mt-4 pulse-on-hover"
                      onClick={(e) => {
                        e.stopPropagation()
                        onNavigate(option.id)
                      }}
                    >
                      Explore {option.title}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Welcome Message */}
        <Card className="mt-12 bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center">
              <Target className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Welcome to PM Standards Analysis
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                This dashboard provides comprehensive analysis and comparison of major project management 
                standards including ISO 21500/21502, PMI PMBOK 7th Edition, and PRINCE2. 
                Start exploring to gain deeper insights into project management methodologies.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard
