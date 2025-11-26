import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Globe } from 'lucide-react'
import logo from '../assets/logo.png'
import logoWhite from '../assets/lanfriqnavlogowhite.png'
import { useTheme } from '../context/ThemeContext'
import './KYCSuccess.css'

const KYCSuccess = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()

  const handleBrowseAssets = () => {
    navigate('/marketplace')
  }

  return (
    <div className="kyc-success">
      <div className="kyc-success__header">
        <div className="kyc-success__logo">
          <img src={theme === 'dark' ? logoWhite : logo} alt="Lanfriq" className="kyc-success__logo-img" />
        </div>
        <div className="kyc-success__language">
          <Globe size={18} />
          <span>English (UK)</span>
        </div>
      </div>

      <div className="kyc-success__container">
        <div className="kyc-success__icon">
          <Check size={48} strokeWidth={3} />
        </div>

        <h1 className="kyc-success__title">Success</h1>
        <p className="kyc-success__description">
          Once verified, you'll gain full access to all validation features. We'll notify you when the process is complete.
        </p>

        <button className="kyc-success__btn" onClick={handleBrowseAssets}>
          Browse Assets
        </button>
      </div>
    </div>
  )
}

export default KYCSuccess
