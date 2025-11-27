import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { Globe } from 'lucide-react'
import authScanImg from '../assets/authScanImg.png'
import logo from '../assets/logo.png'
import logoWhite from '../assets/lanfriqnavlogowhite.png'
import { useTheme } from '../context/ThemeContext'
import './VerifyAccount.css'

const VerifyAccount = () => {
  const navigate = useNavigate()
  const { address } = useAccount()
  const { theme } = useTheme()

  const handleGetVerified = () => {
    // Navigate to verification flow
    navigate('/verification')
  }

  const handleSkip = () => {
    // Mark as skipped in localStorage
    if (address) {
      localStorage.setItem(`lanfriq-verified-${address}`, 'skipped')
    }
    // Navigate to marketplace
    navigate('/marketplace')
  }

  return (
    <div className="verify-account">
      <div className="verify-account__header">
        <div className="verify-account__logo">
          <img src={theme === 'dark' ? logoWhite : logo} alt="Lanfriq" className="verify-account__logo-img" />
        </div>
        <div className="verify-account__language">
          <Globe size={18} />
          <span>English (UK)</span>
        </div>
      </div>

      <div className="verify-account__container">
        <div className="verify-account__content">
          <p className="verify-account__greeting">Yes, You are in!</p>
          <h1 className="verify-account__title">Verify Account</h1>
          <p className="verify-account__description">
            Verify your identity to tokenize properties or create SPVs. You may skip for now if you're only browsing or investing.
          </p>

          <div className="verify-account__actions">
            <button className="btn btn--secondary" onClick={handleSkip}>
              Skip for now
            </button>
            <button className="btn btn--primary" onClick={handleGetVerified}>
              Get Verified
            </button>
          </div>
        </div>

        <div className="verify-account__illustration">
          <img src={authScanImg} alt="Verify Account" className="verify-account__image" />
        </div>
      </div>
    </div>
  )
}

export default VerifyAccount
