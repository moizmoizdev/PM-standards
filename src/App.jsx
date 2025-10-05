import React from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import Navigation from './components/Navigation'
import Hero from './components/Hero'
import Features from './components/Features'
import Footer from './components/Footer'
import Dashboard from './pages/Dashboard'
import Insights from './pages/Insights'
import Comparison from './pages/Comparison'
import ReadBook from './pages/ReadBook'
import Search from './pages/Search'
import './index.css'

function DashboardWrapper() {
  const navigate = useNavigate()
  
  const handleNavigate = (page) => {
    navigate(`/${page}`)
  }
  
  return <Dashboard onNavigate={handleNavigate} />
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground relative">
        {/* Enhanced floating background elements */}
        <div className="floating-elements">
          <div className="floating-circle"></div>
          <div className="floating-circle"></div>
          <div className="floating-circle"></div>
          <div className="floating-square"></div>
          <div className="floating-square"></div>
        </div>
        
        {/* Particle system */}
        <div className="particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
        
        <div className="relative z-10 page-transition">
          <Navigation />
          <Routes>
            <Route path="/" element={
              <main>
                <Hero />
                <Features />
              </main>
            } />
            <Route path="/dashboard" element={<DashboardWrapper />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/comparison" element={<Comparison />} />
            <Route path="/read-book" element={<ReadBook />} />
            <Route path="/search" element={<Search />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </Router>
  )
}

export default App

