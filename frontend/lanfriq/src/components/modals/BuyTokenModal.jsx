import { useState, useEffect } from 'react'
import { X, ArrowLeft } from 'lucide-react'
import PurchaseSuccessModal from './PurchaseSuccessModal'
import './BuyTokenModal.css'

const BuyTokenModal = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const minimum = 5000
  const maximum = 10000

  // Calculate countdown from a target end date (e.g., 10 days from now)
  const getInitialEndTime = () => {
    const now = new Date()
    return new Date(now.getTime() + (10 * 24 * 60 * 60 * 1000)) // 10 days from now
  }

  const [endTime] = useState(getInitialEndTime())
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })

  useEffect(() => {
    if (!isOpen) return

    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const distance = endTime.getTime() - now

      if (distance < 0) {
        setCountdown({ days: 0, hours: 0, mins: 0, secs: 0 })
        return
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const secs = Math.floor((distance % (1000 * 60)) / 1000)

      setCountdown({ days, hours, mins, secs })
    }

    calculateTimeLeft() // Initial calculation
    const timer = setInterval(calculateTimeLeft, 1000) // Update every second

    return () => clearInterval(timer)
  }, [isOpen, endTime])

  const handleBuy = () => {
    setShowSuccess(true)
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
    onClose()
  }

  if (!isOpen) return null

  if (showSuccess) {
    return <PurchaseSuccessModal isOpen={showSuccess} onClose={handleSuccessClose} />
  }

  return (
    <div className="buy-token-overlay" onClick={onClose}>
      <div className="buy-token-modal" onClick={(e) => e.stopPropagation()}>
        <div className="buy-token__header">
          <button className="buy-token__back">
            <ArrowLeft size={20} />
          </button>
          <h2 className="buy-token__title">Buy Token</h2>
          <button className="buy-token__close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="buy-token__content">
          {/* Countdown */}
          <div className="buy-token__countdown-section">
            <h3 className="buy-token__section-title">Sales Ends in</h3>
            <div className="buy-token__countdown">
              <div className="buy-token__countdown-box">
                <span className="buy-token__countdown-value">{countdown.days}</span>
                <span className="buy-token__countdown-label">Days</span>
              </div>
              <div className="buy-token__countdown-box">
                <span className="buy-token__countdown-value">{countdown.hours}</span>
                <span className="buy-token__countdown-label">hrs</span>
              </div>
              <div className="buy-token__countdown-box">
                <span className="buy-token__countdown-value">{countdown.mins}</span>
                <span className="buy-token__countdown-label">mins</span>
              </div>
              <div className="buy-token__countdown-box">
                <span className="buy-token__countdown-value">{countdown.secs}</span>
                <span className="buy-token__countdown-label">secs</span>
              </div>
            </div>
          </div>

          {/* Slider */}
          <div className="buy-token__slider-section">
            <input
              type="range"
              min={minimum}
              max={maximum}
              value={amount || minimum}
              onChange={(e) => setAmount(e.target.value)}
              className="buy-token__slider"
            />
            <div className="buy-token__slider-labels">
              <span>Minimum: {minimum.toLocaleString()}</span>
              <span>Maximum: {maximum.toLocaleString()}</span>
            </div>
          </div>

          {/* Amount Input */}
          <div className="buy-token__amount-section">
            <h3 className="buy-token__section-title">Amount</h3>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="buy-token__input"
            />
            <div className="buy-token__receive">
              <span>You receive: 1,000, 000 tokens</span>
              <button className="buy-token__max">Max</button>
            </div>
          </div>

          {/* Buy Button */}
          <button className="buy-token__buy-btn" onClick={handleBuy}>
            Buy now
          </button>
        </div>
      </div>
    </div>
  )
}

export default BuyTokenModal
