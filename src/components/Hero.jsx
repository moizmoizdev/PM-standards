import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { ArrowRight, Play, TrendingUp, Users, Target } from 'lucide-react'

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Simple background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background to-muted/20" />
      
      {/* Subtle background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-muted px-4 py-2 rounded-full text-sm font-medium mb-8">
          <span className="text-primary">●</span>
          <span>Project Management Platform</span>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
          Modern Project{' '}
          <span className="gradient-text">
            Management
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl sm:text-2xl text-muted-foreground max-w-4xl mx-auto mb-8 leading-relaxed">
          Compare PMBOK, ISO 21500, and PRINCE2 standards with intelligent search, 
          interactive comparisons, and comprehensive insights for better project management.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Link to="/dashboard">
            <Button size="lg" className="text-lg px-8 py-3 h-auto pulse-on-hover hover-glow">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link to="/insights">
            <Button variant="outline" size="lg" className="text-lg px-8 py-3 h-auto group hover-glow">
              <Play className="mr-2 h-5 w-5" />
              View Insights
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-3">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-foreground">4</div>
            <div className="text-sm text-muted-foreground">PM Standards</div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-3">
              <Target className="h-6 w-6 text-primary" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-foreground">4</div>
            <div className="text-sm text-muted-foreground">Digital Books</div>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-lg mb-3">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-foreground">9</div>
            <div className="text-sm text-muted-foreground">Topic Areas</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-muted-foreground/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}

export default Hero