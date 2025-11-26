import { NavLink } from 'react-router-dom'
import { Store, Home, Package, Tag, Heart, User, Bell } from 'lucide-react'
import logo from '../../assets/logo.png'
import './Sidebar.css'

const Sidebar = () => {
  const navItems = [
    { path: '/marketplace', icon: Store, label: 'Market' }
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar__logo">
        <img src={logo} alt="Lanfriq" />
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
