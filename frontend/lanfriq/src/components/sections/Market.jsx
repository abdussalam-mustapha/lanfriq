import { useTheme } from '../../context/ThemeContext'
import './Market.css'

const Market = () => {
  const { theme } = useTheme()
  
  return (
    <section className="market">
      <div className="container">
        <div className="market__card">
          <div className="market__header">
            <div className="market__logo">
              <div className="market__logo-icon"></div>
              <span className="market__logo-text">LANFRIQ</span>
            </div>
            <div className="market__nav">
              <div className="market__nav-item market__nav-item--active">
                <span className="market__nav-icon">📊</span>
                <span>Market</span>
              </div>
            </div>
            <div className="market__actions">
              <button className="market__btn market__btn--add">+</button>
              <button className="market__btn">🔍</button>
              <button className="market__btn">🔔</button>
              <button className="market__btn">👤</button>
            </div>
          </div>
          
          <div className="market__content">
            <div className="market__sidebar">
              <div className="market__section">
                <h3 className="market__section-title">ACTION</h3>
                <div className="market__menu-item market__menu-item--active">
                  <span className="market__menu-icon">📊</span>
                  <span>Market</span>
                </div>
                <div className="market__menu-item">
                  <span className="market__menu-icon">💼</span>
                  <span>Wallet</span>
                </div>
                <div className="market__menu-item">
                  <span className="market__menu-icon">📝</span>
                  <span>Offer</span>
                </div>
              </div>
              
              <div className="market__section">
                <h3 className="market__section-title">PORTFOLIO</h3>
                <div className="market__menu-item">
                  <span className="market__menu-icon">🏠</span>
                  <span>Asset</span>
                </div>
                <div className="market__menu-item">
                  <span className="market__menu-icon">🎨</span>
                  <span>NFT</span>
                </div>
                <div className="market__menu-item">
                  <span className="market__menu-icon">⭐</span>
                  <span>Wishlist</span>
                </div>
              </div>
              
              <div className="market__section">
                <h3 className="market__section-title">RESOURCES</h3>
                <div className="market__menu-item">
                  <span className="market__menu-icon">⚙️</span>
                  <span>Settings</span>
                </div>
                <div className="market__menu-item">
                  <span className="market__menu-icon">❓</span>
                  <span>Support / Help</span>
                </div>
              </div>
            </div>
            
            <div className="market__main">
              <div className="market__intro">
                <h2 className="market__intro-title">Market</h2>
                <p className="market__intro-text">
                  Discover verified real estate opportunities across Africa with blockchain-backed trust.
                </p>
              </div>
              
              <div className="market__featured">
                <div className="market__featured-card">
                  <div className="market__featured-image"></div>
                  <div className="market__featured-info">
                    <h4>TokenArt Treasures</h4>
                    <p>Value: 500.07 USDT</p>
                  </div>
                  <button className="market__btn-buy">Buy Now</button>
                </div>
                <div className="market__featured-card">
                  <div className="market__featured-image"></div>
                  <div className="market__featured-info">
                    <h4>TokenArt Treasures</h4>
                    <p>Value: 500.07 USDT</p>
                  </div>
                  <button className="market__btn-buy">Buy Now</button>
                </div>
              </div>
              
              <div className="market__properties">
                <div className="market__property-card">
                  <div className="market__property-image"></div>
                  <div className="market__property-info">
                    <h4>BlockWealth Assets</h4>
                    <p className="market__property-price">200.102 SOL</p>
                  </div>
                </div>
                <div className="market__property-card">
                  <div className="market__property-image"></div>
                  <div className="market__property-info">
                    <h4>BlockWealth Assets</h4>
                    <p className="market__property-price">200.102 SOL</p>
                  </div>
                </div>
                <div className="market__property-card">
                  <div className="market__property-image"></div>
                  <div className="market__property-info">
                    <h4>BlockWealth Assets</h4>
                    <p className="market__property-price">200.102 SOL</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Market