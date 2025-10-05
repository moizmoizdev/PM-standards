import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { 
  BarChart3, 
  GitCompare, 
  Lightbulb, 
  Shield, 
  Zap, 
  Target,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  ArrowRight
} from 'lucide-react'
import { Button } from './ui/button'

const Features = () => {
  const mainFeatures = [
    {
      icon: BarChart3,
      title: "Interactive Heatmap",
      description: "Visual comparison matrix showing coverage and emphasis of PM topics across ISO, PMI, and PRINCE2 standards.",
      color: "text-stone-700",
      bgColor: "bg-stone-100"
    },
    {
      icon: GitCompare,
      title: "Cross-Standard Comparison",
      description: "Side-by-side analysis of PMBOK, ISO 21500, and PRINCE2 methodologies with detailed topic comparisons.",
      color: "text-amber-800",
      bgColor: "bg-amber-100"
    },
    {
      icon: Lightbulb,
      title: "AI-Powered Search",
      description: "Intelligent semantic search across all standards with keyword and meaning-based discovery capabilities.",
      color: "text-rose-700",
      bgColor: "bg-rose-100"
    },
    {
      icon: Shield,
      title: "Digital Book Reader",
      description: "Comprehensive reading experience with multi-level navigation through PMBOK, ISO, and PRINCE2 content.",
      color: "text-slate-700",
      bgColor: "bg-slate-100"
    }
  ]

  const benefits = [
    {
      icon: TrendingUp,
      title: "Standards Coverage",
      stat: "4",
      description: "Major PM frameworks"
    },
    {
      icon: Users,
      title: "Topic Areas",
      stat: "9",
      description: "Comprehensive analysis"
    },
    {
      icon: Clock,
      title: "Search Speed",
      stat: "<3s",
      description: "Fast results delivery"
    },
    {
      icon: CheckCircle,
      title: "Content Accuracy",
      stat: "100%",
      description: "Verified sources"
    }
  ]

  return (
    <section id="features" className="py-24 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Comprehensive PM{' '}
            <span className="text-primary">
              Standards Analysis
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Compare, analyze, and understand PMBOK, ISO 21500, and PRINCE2 standards with intelligent tools
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {mainFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 card-hover-effect">
                <CardHeader className="pb-4">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-xl">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed mb-4">
                    {feature.description}
                  </CardDescription>
                  <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary/80 group/btn pulse-on-hover">
                    Learn more
                    <ArrowRight className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Benefits Section */}
        <Card className="shadow-sm">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl sm:text-3xl">
              Platform Capabilities
            </CardTitle>
            <CardDescription className="text-lg">
              Comprehensive analysis tools for project management standards
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <div key={index} className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-lg mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-3xl font-bold text-foreground mb-2">{benefit.stat}</div>
                    <div className="text-sm font-medium text-foreground mb-1">{benefit.title}</div>
                    <div className="text-sm text-muted-foreground">{benefit.description}</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default Features