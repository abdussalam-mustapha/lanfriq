import { useNavigate } from 'react-router-dom'
import { Globe, User, Building2 } from 'lucide-react'
import logo from '../assets/logo.png'
import logoWhite from '../assets/lanfriqnavlogowhite.png'
import { useTheme } from '../context/ThemeContext'
import './UserTypeSelection.css'

const UserTypeSelection = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()

  const handleUserTypeSelect = (type) => {
    // Store user type selection
    localStorage.setItem('lanfriq-user-type', type)
    // Navigate to appropriate verification form
    navigate(`/verification/${type}`)
  }

  return (
    <div className="user-type-selection">
      <div className="user-type-selection__header">
        <div className="user-type-selection__logo">
          <img src={theme === 'dark' ? logoWhite : logo} alt="Lanfriq" className="user-type-selection__logo-img" />
        </div>
        <div className="user-type-selection__language">
          <Globe size={18} />
          <span>English (UK)</span>
        </div>
      </div>

      <div className="user-type-selection__container">
        <div className="user-type-selection__content">
          <h1 className="user-type-selection__title">Who are you?</h1>
          <p className="user-type-selection__description">
            Select the type of user that resonate with you
          </p>

          <div className="user-type-selection__cards">
            <button 
              className="user-type-card"
              onClick={() => handleUserTypeSelect('individual')}
            >
              <div className="user-type-card__icon-wrapper">
                <User size={32} className="user-type-card__icon" />
              </div>
              <div className="user-type-card__content">
                <h3 className="user-type-card__title">Individual (KYC)</h3>
                <p className="user-type-card__description">
                  For personal property owners (NIN, BVN, SSN, National ID...)
                </p>
              </div>
            </button>

            <button 
              className="user-type-card"
              onClick={() => handleUserTypeSelect('business')}
            >
              <div className="user-type-card__icon-wrapper">
                <Building2 size={32} className="user-type-card__icon" />
              </div>
              <div className="user-type-card__content">
                <h3 className="user-type-card__title">Business (KYB)</h3>
                <p className="user-type-card__description">
                  For companies, developers, estates (CAC, TIN, director IDs)
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserTypeSelection
