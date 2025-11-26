import { NavLink } from 'react-router-dom'
import { Store, Home, Package, Tag, Heart, User, Bell } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import logo from '../../assets/logo.png'
import logoWhite from '../../assets/lanfriqnavlogowhite.png'
import './Sidebar.css'

const Sidebar = () => {
  const { theme } = useTheme()
  
  const navItems = [
    { path: '/marketplace', icon: Store, label: 'Market' },
    { path: '/tokenization-hub', icon: Package, label: 'Tokenization Hub' },
    { path: '/my-assets', icon: Home, label: 'My Assets' },
    { path: '/offers', icon: Tag, label: 'Offers' },
    { path: '/favorites', icon: Heart, label: 'Favorites' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/notifications', icon: Bell, label: 'Notifications' }
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <img src={theme === 'dark' ? logoWhite : logo} alt="Lanfriq" />
      </div>
      
      <nav className="sidebar__nav">
        {navItems.map((item) => (
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
      </nav>
    </aside>
  )
}

export default Sidebar
