import { X, Check } from 'lucide-react'
import logo from '../../assets/logo.png'
import './PurchaseSuccessModal.css'

const PurchaseSuccessModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className="purchase-success-overlay" onClick={onClose}>
      <div className="purchase-success-modal" onClick={(e) => e.stopPropagation()}>
        <div className="purchase-success__header">
          <img src={logo} alt="Lanfriq" className="purchase-success__logo" />
          <button className="purchase-success__close" onClick={onClose}>
            <X size={20} />
            Close this tab
          </button>
        </div>

        <div className="purchase-success__content">
          <div className="purchase-success__icon-wrapper">
            <div className="purchase-success__icon-bg"></div>
            <Check size={64} className="purchase-success__icon" />
          </div>

          <h2 className="purchase-success__title">Success</h2>
          <p className="purchase-success__message">
            Asset has been successfully purchased
          </p>

          <button className="purchase-success__mint-btn">Mint NFT</button>
          <button className="purchase-success__view-btn" onClick={onClose}>
            View asset
          </button>
        </div>
      </div>
    </div>
  )
}

export default PurchaseSuccessModal
