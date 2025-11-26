import { useNavigate } from 'react-router-dom'
import { X, User } from 'lucide-react'
import './VerificationRequiredModal.css'

const VerificationRequiredModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate()

  const handleVerifyNow = () => {
    navigate('/verification')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="verification-required-overlay" onClick={onClose}>
      <div className="verification-required-modal" onClick={(e) => e.stopPropagation()}>
        <button className="verification-required__close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="verification-required__content">
          <div className="verification-required__scan-frame">
            <div className="verification-required__scan-corners">
              <div className="verification-required__corner verification-required__corner--tl"></div>
              <div className="verification-required__corner verification-required__corner--tr"></div>
              <div className="verification-required__corner verification-required__corner--bl"></div>
              <div className="verification-required__corner verification-required__corner--br"></div>
            </div>
            <div className="verification-required__icon-wrapper">
              <div className="verification-required__icon-bg"></div>
              <User size={48} className="verification-required__icon" />
            </div>
          </div>

          <h2 className="verification-required__title">Verification Required</h2>
          <p className="verification-required__message">
            You need to verify your identity or business<br />to tokenize properties.
          </p>

          <button className="verification-required__button" onClick={handleVerifyNow}>
            Verify Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default VerificationRequiredModal
