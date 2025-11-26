import { useNavigate } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { Globe } from 'lucide-react'
import './VerifyAccount.css'

const VerifyAccount = () => {
  const navigate = useNavigate()
  const { address } = useAccount()

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
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 4L12 8L20 4L12 0L4 4Z" fill="#8cc043"/>
            <path d="M4 8V16L12 20V12L4 8Z" fill="#8cc043"/>
            <path d="M20 8V16L12 20V12L20 8Z" fill="#8cc043"/>
          </svg>
          <span className="verify-account__brand">Lanfriq</span>
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
          <div className="verify-card">
            <div className="verify-card__frame">
              <div className="verify-card__avatar">
                <div className="verify-card__avatar-icon">
                  <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                    <circle cx="40" cy="30" r="15" fill="#8cc043"/>
                    <path d="M20 65C20 55 28 50 40 50C52 50 60 55 60 65V70H20V65Z" fill="#8cc043"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VerifyAccount
