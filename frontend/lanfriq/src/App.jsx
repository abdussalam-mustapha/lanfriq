import { ThemeProvider } from './context/ThemeContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Hero from './components/sections/Hero'
import Features from './components/sections/Features'
import TargetAudience from './components/sections/TargetAudience'
import Statistics from './components/sections/Statistics'
import HowItWorks from './components/sections/HowItWorks'
import CTA from './components/sections/CTA'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <main>
          <Hero />
          <Features />
          <TargetAudience />
          <Statistics />
          <HowItWorks />
          <CTA />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App
