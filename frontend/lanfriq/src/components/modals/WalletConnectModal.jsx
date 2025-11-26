import { X, Globe, ArrowRight } from 'lucide-react'
import './WalletConnectModal.css'

const WalletConnectModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  const wallets = [
    {
      id: 'metamask',
      name: 'Metamask',
      icon: '🦊',
      popular: true
    },
    {
      id: 'coinbase',
      name: 'Coinbase',
      icon: '🔵'
    },
    {
      id: 'phantom',
      name: 'Phantom',
      icon: '👻'
    },
    {
      id: 'rabby',
      name: 'Rabby',
      icon: '🐰'
    },
    {
      id: 'walletconnect',
      name: 'WalletConnect',
      icon: '🔗'
    }
  ]

  const handleWalletConnect = (walletId) => {
    console.log('Connecting to:', walletId)
    // Wallet connection logic will be implemented later
  }

  const handleLoadMore = () => {
    console.log('Load more wallets')
    // Load more wallets logic
  }

  return (
    <div className="wallet-modal-overlay" onClick={onClose}>
      <div className="wallet-modal" onClick={(e) => e.stopPropagation()}>
        <div className="wallet-modal__header">
          <div className="wallet-modal__logo">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 4L12 8L20 4L12 0L4 4Z" fill="#8cc043"/>
              <path d="M4 8V16L12 20V12L4 8Z" fill="#8cc043"/>
              <path d="M20 8V16L12 20V12L20 8Z" fill="#8cc043"/>
            </svg>
            <span className="wallet-modal__brand">Lanfriq</span>
          </div>
          <div className="wallet-modal__language">
            <Globe size={18} />
            <span>English (UK)</span>
          </div>
        </div>

        <h2 className="wallet-modal__title">Connect Wallet</h2>

        <div className="wallet-modal__list">
          {wallets.map((wallet) => (
            <button
              key={wallet.id}
              className={`wallet-option ${wallet.popular ? 'wallet-option--popular' : ''}`}
              onClick={() => handleWalletConnect(wallet.id)}
            >
              <div className="wallet-option__content">
                <span className="wallet-option__icon">{wallet.icon}</span>
                <span className="wallet-option__name">{wallet.name}</span>
              </div>
              {wallet.popular && (
                <ArrowRight size={20} className="wallet-option__arrow" />
              )}
            </button>
          ))}
        </div>

        <button className="wallet-modal__load-more" onClick={handleLoadMore}>
          Load More
        </button>

        <p className="wallet-modal__terms">
          By connecting your wallet and using Lanfriq, you agree to our{' '}
          <a href="/terms" className="wallet-modal__link">Terms of Services</a>
          {' '}and{' '}
          <a href="/privacy" className="wallet-modal__link">Privacy Policy</a>.
        </p>
      </div>
    </div>
  )
}

export default WalletConnectModal
