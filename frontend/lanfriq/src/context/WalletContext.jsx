import { createContext, useContext, useEffect, useRef } from 'react'
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
  const previousConnectionStatus = useRef(isConnected)

  useEffect(() => {
    // Only redirect when connection status changes from disconnected to connected
    const justConnected = isConnected && !previousConnectionStatus.current && address
    
    // Update the ref for next render
    previousConnectionStatus.current = isConnected

    if (justConnected) {
      // Check if user has already verified or skipped verification
      const verificationStatus = localStorage.getItem(`lanfriq-verified-${address}`)
      
      // Skip redirection if on verification page or already verified/skipped
      const skipRedirect = location.pathname === '/verify-account' || 
                          location.pathname === '/verification' ||
                          verificationStatus === 'verified' ||
                          verificationStatus === 'skipped'
      
      if (!skipRedirect) {
        console.log('Wallet connected! Redirecting to verification page...')
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
