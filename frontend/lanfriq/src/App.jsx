import { ThemeProvider } from './context/ThemeContext'
import Footer from './components/layout/Footer'
import LandingPage from './pages/landing/LandingPage'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <main>
          <LandingPage />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}

export default App
