import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('lanfriq-theme')
    // If no theme is saved, set dark as default
    if (!savedTheme) {
      localStorage.setItem('lanfriq-theme', 'dark')
      document.documentElement.setAttribute('data-theme', 'dark')
      return 'dark'
    }
    return savedTheme
  })

  useEffect(() => {
    localStorage.setItem('lanfriq-theme', theme)
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
