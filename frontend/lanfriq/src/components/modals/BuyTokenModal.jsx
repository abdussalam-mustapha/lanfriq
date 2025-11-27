import { useState } from 'react'
import { X, ArrowLeft } from 'lucide-react'
import PurchaseSuccessModal from './PurchaseSuccessModal'
import './BuyTokenModal.css'

const BuyTokenModal = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const minimum = 5000
  const maximum = 10000

  const countdown = {
    days: 10,
    hours: 5,
    mins: 5,
    secs: 5
  }

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
