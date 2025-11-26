import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Bell, User } from 'lucide-react'
import SearchModal from '../modals/SearchModal'
import NotificationPanel from '../modals/NotificationPanel'
import Sidebar from './Sidebar'
import './AppLayout.css'

const AppLayout = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)
  const navigate = useNavigate()

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
            <button className="app-layout__connect-btn" onClick={() => navigate('/verify-account')}>
              <User size={18} />
              <span>0x1...fXp</span>
            </button>
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
