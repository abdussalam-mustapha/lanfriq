import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useTheme } from '../../context/ThemeContext'
import { ChevronDown, Bell, Menu, X } from 'lucide-react'
import logo from '../../assets/logo.png'
import logoWhite from '../../assets/lanfriqnavlogowhite.png'
import './Header.css'

const Header = () => {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()
  const [isUseCaseOpen, setIsUseCaseOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const currentLogo = theme === 'dark' ? logoWhite : logo
  const isLandingPage = location.pathname === '/'

  const navLinks = [
    { path: '/marketplace', label: 'Marketplace' },
    { path: '/tokenization-hub', label: 'Tokenization Hub' },
    { path: '/assets', label: 'My Assets' },
    { path: '/offers', label: 'Offers' },
    { path: '/favorites', label: 'Favorites' },
  ]

  // Don't show full nav on landing page
  if (isLandingPage) {
    return (
      <>
      <header className="header">
        <div className="container">
          <nav className="nav">
            <Link to="/" className="nav__logo">
              <img src={currentLogo} alt="Lanfriq" className="nav__logo-img" />
            </Link>
            
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
                className="nav__mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
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
              <div className="nav__connect-wallet">
                <ConnectButton />
              </div>
            </div>
          </nav>
          
          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="nav__mobile-overlay">
              <nav className="nav__mobile-menu">
                <a href="#benefits" className="nav__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Benefits</a>
                <a href="#investors" className="nav__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>For Investors</a>
                <a href="#property-owners" className="nav__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Property Owners</a>
                <a href="#businesses" className="nav__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>Business/Firm</a>
                <a href="#how-it-works" className="nav__mobile-link" onClick={() => setIsMobileMenuOpen(false)}>How It Works</a>
                <div style={{ marginTop: '20px' }}>
                  <ConnectButton />
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
      </>
    )
  }

  // App header with full navigation
  return (
    <>
      <header className="header header--app">
      <div className="container">
        <nav className="nav">
          <Link to="/" className="nav__logo">
            <img src={currentLogo} alt="Lanfriq" className="nav__logo-img" />
          </Link>
          
          <ul className="nav__menu">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link 
                  to={link.path} 
                  className={`nav__link ${location.pathname === link.path ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          
          <div className="nav__actions">
            <button 
              className="nav__mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <Link to="/notifications" className="nav__icon-btn">
              <Bell size={20} />
            </Link>
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
              <div className="nav__connect-wallet">
                <ConnectButton />
              </div>
            </div>
          </nav>
          
          {/* Mobile Menu Overlay */}
          {isMobileMenuOpen && (
            <div className="nav__mobile-overlay">
              <nav className="nav__mobile-menu">
                {navLinks.map((link) => (
                  <Link 
                    key={link.path}
                    to={link.path} 
                    className="nav__mobile-link"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
                <div style={{ marginTop: '20px' }}>
                  <ConnectButton />
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  )
}

export default Header