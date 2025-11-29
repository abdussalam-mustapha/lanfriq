import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, User, Copy, LogOut } from 'lucide-react'
import { useAccount, useDisconnect } from 'wagmi'
import SearchModal from '../modals/SearchModal'
import NotificationPanel from '../modals/NotificationPanel'
import Sidebar from './Sidebar'
import './AppLayout.css'

const AppLayout = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)
  const navigate = useNavigate()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()

  const shortenAddress = (addr) => {
    if (!addr) return ''
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
  }

  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address)
      alert('Address copied to clipboard!')
    }
  }

  const handleDisconnect = () => {
    disconnect()
    setShowWalletModal(false)
  }

  const walletModalRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (walletModalRef.current && !walletModalRef.current.contains(event.target)) {
        setShowWalletModal(false)
      }
    }

    if (showWalletModal) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showWalletModal])

  return (
    <div className="app-layout">
      <Sidebar />
      
      <div className="app-layout__main">
        <header className="app-layout__header">
          <div className="app-layout__header-left">
            <button className="app-layout__icon-btn" onClick={() => navigate('/marketplace')}>
              <Search size={20} />
            </button>
          </div>

          <div className="app-layout__header-right">
            <button className="app-layout__icon-btn" onClick={() => setIsSearchOpen(true)}>
              <Search size={20} />
            </button>
            <button className="app-layout__icon-btn app-layout__notification-btn" onClick={() => setIsNotificationOpen(true)}>
              <Bell size={20} />
              <span className="app-layout__notification-badge">2</span>
            </button>
            {isConnected ? (
              <div className="app-layout__wallet-wrapper" ref={walletModalRef}>
                <button 
                  className="app-layout__connect-btn" 
                  onClick={() => setShowWalletModal(!showWalletModal)}
                >
                  <User size={18} />
                  <span>{shortenAddress(address)}</span>
                </button>
                {showWalletModal && (
                  <div className="app-layout__wallet-modal">
                    <button className="app-layout__wallet-option" onClick={copyAddress}>
                      <Copy size={16} />
                      <span>Copy Address</span>
                    </button>
                    <button className="app-layout__wallet-option" onClick={handleDisconnect}>
                      <LogOut size={16} />
                      <span>Disconnect</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button className="app-layout__connect-btn" onClick={() => navigate('/verify-account')}>
                <User size={18} />
                <span>Connect Wallet</span>
              </button>
            )}
          </div>
        </header>

        <main className="app-layout__content">
          {children}
        </main>
      </div>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <NotificationPanel isOpen={isNotificationOpen} onClose={() => setIsNotificationOpen(false)} />
    </div>
  )
}

export default AppLayout
