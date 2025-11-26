import { createContext, useContext, useEffect } from 'react'
import { useAccount } from 'wagmi'
import { useNavigate, useLocation } from 'react-router-dom'

const WalletContext = createContext()

export const useWallet = () => {
  const context = useContext(WalletContext)
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider')
  }
  return context
}

export const WalletProvider = ({ children }) => {
  const { address, isConnected } = useAccount()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Redirect to verify account page after wallet connection
    if (isConnected && address && location.pathname === '/') {
      // Check if user has been verified (you can add localStorage or API check here)
      const hasVerified = localStorage.getItem(`lanfriq-verified-${address}`)
      
      if (!hasVerified) {
        navigate('/verify-account')
      }
    }
  }, [isConnected, address, navigate, location.pathname])

  return (
    <WalletContext.Provider value={{ address, isConnected }}>
      {children}
    </WalletContext.Provider>
  )
}
