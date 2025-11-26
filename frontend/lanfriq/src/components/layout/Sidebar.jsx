import { NavLink } from 'react-router-dom'
import { Store, Wallet, Tag, Home, Package, Heart, User, Bell, Settings, HelpCircle } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import logo from '../../assets/logo.png'
import logoWhite from '../../assets/lanfriqnavlogowhite.png'
import './Sidebar.css'

const Sidebar = () => {
  const { theme } = useTheme()
  
  const navSections = [
    {
      title: 'Actions',
      items: [
        { path: '/marketplace', icon: Store, label: 'Market' },
        { path: '/wallet', icon: Wallet, label: 'Wallet' },
        { path: '/offers', icon: Tag, label: 'Offer' }
      ]
    },
    {
      title: 'Portfolio',
      items: [
        { path: '/my-assets', icon: Home, label: 'Assets' },
        { path: '/tokenization-hub', icon: Package, label: 'Tokenization Hub' },
        { path: '/favorites', icon: Heart, label: 'Favorites' },
        { path: '/wishlist', icon: Heart, label: 'Wishlist' }
      ]
    },
    {
      title: 'Resources',
      items: [
        { path: '/settings', icon: Settings, label: 'Settings' },
        { path: '/support', icon: HelpCircle, label: 'Support/Help' }
      ]
    }
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <img src={theme === 'dark' ? logoWhite : logo} alt="Lanfriq" />
      </div>
      
      <nav className="sidebar__nav">
        {navSections.map((section) => (
          <div key={section.title} className="sidebar__section">
            <div className="sidebar__section-title">{section.title}</div>
            <div className="sidebar__section-items">
              {section.items.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => 
                    `sidebar__nav-item ${isActive ? 'sidebar__nav-item--active' : ''}`
                  }
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>
    </aside>
  )
}

export default Sidebar
