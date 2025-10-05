import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Lightbulb, GitCompare, BookOpen, ArrowRight, BarChart3, Target, Users } from 'lucide-react'

const Dashboard = ({ onNavigate }) => {
  const dashboardOptions = [
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
      features: ['Side-by-side Analysis', '9 Topic Areas', '4 Standards']
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
      value: '4',
      label: 'PM Standards',
      color: 'text-blue-600'
    },
    {
      icon: BarChart3,
      value: '4',
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
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4 gradient-text">
            PM Standards Hub
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            Your comprehensive platform for analyzing and comparing project management standards. 
            Explore insights, compare methodologies, and access complete documentation.
          </p>
          
          {/* Compact Stats */}
          <div className="flex justify-center items-center gap-8 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                  <span className="font-semibold text-gray-900">{stat.value}</span>
                  <span className="text-gray-600">{stat.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Main Options */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {dashboardOptions.map((option) => {
            const Icon = option.icon
            return (
              <Card 
                key={option.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${option.borderColor} hover-glow card-hover-effect`}
                onClick={() => onNavigate(option.id)}
              >
                <CardHeader className="pb-4">
                  <div className={`w-12 h-12 rounded-lg ${option.bgColor} flex items-center justify-center mb-4`}>
                    <Icon className={`h-6 w-6 ${option.color}`} />
                  </div>
                  <CardTitle className="text-xl mb-2">{option.title}</CardTitle>
                  <CardDescription className="text-gray-600">
                    {option.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-2 mb-4">
                    {option.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                        {feature}
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="w-full pulse-on-hover"
                    disabled={option.disabled}
                  >
                    {option.disabled ? 'Coming Soon' : 'Explore'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              variant="outline" 
              onClick={() => onNavigate('search')}
              className="flex items-center gap-2"
            >
              🔍 Search Standards
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onNavigate('comparison')}
              className="flex items-center gap-2"
            >
              📊 Compare Standards
            </Button>
            <Button 
              variant="outline" 
              onClick={() => onNavigate('read-book')}
              className="flex items-center gap-2"
            >
              📖 Browse Books
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
