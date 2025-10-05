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
      title: "Advanced Analytics",
      description: "Get deep insights into your project performance with comprehensive analytics and reporting tools.",
      color: "text-stone-700",
      bgColor: "bg-stone-100"
    },
    {
      icon: GitCompare,
      title: "Smart Comparisons",
      description: "Compare different methodologies and approaches to find the best fit for your specific project needs.",
      color: "text-amber-800",
      bgColor: "bg-amber-100"
    },
    {
      icon: Lightbulb,
      title: "Intelligent Insights",
      description: "Receive actionable recommendations based on data analysis and industry best practices.",
      color: "text-rose-700",
      bgColor: "bg-rose-100"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Keep your project data secure with enterprise-grade security features and compliance standards.",
      color: "text-slate-700",
      bgColor: "bg-slate-100"
    }
  ]

  const benefits = [
    {
      icon: TrendingUp,
      title: "Efficiency",
      stat: "40%",
      description: "Faster project delivery"
    },
    {
      icon: Users,
      title: "Collaboration",
      stat: "85%",
      description: "Better team alignment"
    },
    {
      icon: Clock,
      title: "Time Saved",
      stat: "60%",
      description: "Reduction in planning time"
    },
    {
      icon: CheckCircle,
      title: "Success Rate",
      stat: "95%",
      description: "Project completion rate"
    }
  ]

  return (
    <section id="features" className="py-24 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Powerful Features for{' '}
            <span className="text-primary">
              Modern Teams
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to manage projects efficiently and deliver exceptional results
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
              Proven Results
            </CardTitle>
            <CardDescription className="text-lg">
              Join thousands of teams achieving better project outcomes
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