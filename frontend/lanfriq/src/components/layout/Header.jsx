import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import { ChevronDown, Wallet } from 'lucide-react'
import logo from '../../assets/logo.png'
import './Header.css'

const Header = () => {
  const { theme, toggleTheme } = useTheme()
  const [isUseCaseOpen, setIsUseCaseOpen] = useState(false)

  return (
    <header className="header">
      <div className="container">
        <nav className="nav">
          <div className="nav__logo">
            <img src={logo} alt="Lanfriq" className="nav__logo-img" />
          </div>
          
          <ul className="nav__menu">
            <li><a href="#benefits" className="nav__link">Benefits</a></li>
            <li className="nav__dropdown">
              <button 
                className="nav__link nav__dropdown-trigger"
                onClick={() => setIsUseCaseOpen(!isUseCaseOpen)}
                aria-expanded={isUseCaseOpen}
              >
                Use Case
                <ChevronDown size={12} strokeWidth={1.5} />
              </button>
              {isUseCaseOpen && (
                <ul className="nav__dropdown-menu">
                  <li><a href="#investors">For Investors</a></li>
                  <li><a href="#property-owners">Property Owners</a></li>
                  <li><a href="#businesses">Business/Firm</a></li>
                </ul>
              )}
            </li>
            <li><a href="#how-it-works" className="nav__link">How It Works</a></li>
          </ul>
          
          <div className="nav__actions">
            <button 
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"></circle>
                  <line x1="12" y1="1" x2="12" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="23"></line>
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                  <line x1="1" y1="12" x2="3" y2="12"></line>
                  <line x1="21" y1="12" x2="23" y2="12"></line>
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                </svg>
              )}
            </button>
            <button className="btn btn--connect-wallet">
              <Wallet size={20} strokeWidth={2} />
              <span>Connect Wallet</span>
            </button>
          </div>
        </nav>
      </div>
    </header>
  )
}

export default Header
