import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Search, TrendingUp, TrendingDown, MoreVertical } from 'lucide-react';
import SellModal from '../../components/SellModal';
import './MyAssets.css';

const MyAssets = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [showSellModal, setShowSellModal] = useState(false)

  const assets = [
    {
      id: 1,
      name: 'Proper Token',
      collection: 'HED - H8AAGCH',
      image: '/assets/property1.jpg',
      tokenNo: 10,
      purchasePrice: 200.00,
      currentPrice: 300.00,
      performance: 2,
      isPositive: true
    },
    {
      id: 2,
      name: 'Proper Token',
      collection: 'HED - H8AAGCH',
      image: '/assets/property2.jpg',
      tokenNo: 10,
      purchasePrice: 200.00,
      currentPrice: 300.00,
      performance: 2,
      isPositive: true
    },
    {
      id: 3,
      name: 'Proper Token',
      collection: 'HED - H8AAGCH',
      image: '/assets/property3.jpg',
      tokenNo: 10,
      purchasePrice: 200.00,
      currentPrice: 300.00,
      performance: -3,
      isPositive: false
    },
    {
      id: 4,
      name: 'Proper Token',
      collection: 'HED - H8AAGCH',
      image: '/assets/property4.jpg',
      tokenNo: 10,
      purchasePrice: 200.00,
      currentPrice: 300.00,
      performance: 2,
      isPositive: true
    },
    {
      id: 5,
      name: 'Proper Token',
      collection: 'HED - H8AAGCH',
      image: '/assets/property5.jpg',
      tokenNo: 10,
      purchasePrice: 200.00,
      currentPrice: 300.00,
      performance: 2,
      isPositive: true
    }
  ]

  const handleSellClick = (asset, e) => {
    e.stopPropagation()
    setSelectedAsset(asset)
    setShowSellModal(true)
  }

  const handleAssetClick = (assetId) => {
    navigate(`/my-assets/${assetId}`)
  }

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.collection.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="my-assets">
      <div className="my-assets__header">
        <div className="my-assets__header-icon">
          <Building2 size={20} />
        </div>
        <h1 className="my-assets__title">Asset</h1>
      </div>

      <p className="my-assets__description">
        Discover verified real estate opportunities across Africa with blockchain-backed trust.
      </p>

      {/* Hero Banner */}
      <div className="my-assets__hero">
        <div className="my-assets__hero-content">
          <h2>Discover opportunities<br />in the modern market.</h2>
          <p>Explore Lanfriq's marketplace</p>
          <button className="my-assets__hero-btn">
            Explore market
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        <div className="my-assets__hero-graphic">
          <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8cc043" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#8cc043" stopOpacity="0.8" />
              </linearGradient>
            </defs>
            {Array.from({ length: 30 }).map((_, i) => (
              <line
                key={i}
                x1={i * 15}
                y1={150 + Math.sin(i * 0.3) * 50}
                x2={i * 15}
                y2="300"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                opacity={0.6}
              />
            ))}
          </svg>
        </div>
      </div>

      {/* Assets List */}
      <div className="my-assets__list-section">
        <div className="my-assets__list-header">
          <h3>List of Asset</h3>
          <div className="my-assets__search">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search asset"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="my-assets__table-wrapper">
          <table className="my-assets__table">
            <thead>
              <tr>
                <th>Collection name</th>
                <th>Token No</th>
                <th>Purchase price</th>
                <th>Current price</th>
                <th>Performance</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset) => (
                <tr 
                  key={asset.id}
                  onClick={() => handleAssetClick(asset.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <td>
                    <div className="my-assets__collection">
                      <div className="my-assets__collection-image">
                        <Building2 size={24} />
                      </div>
                      <div className="my-assets__collection-info">
                        <div className="my-assets__collection-name">{asset.name}</div>
                        <div className="my-assets__collection-id">{asset.collection}</div>
                      </div>
                    </div>
                  </td>
                  <td>{asset.tokenNo}</td>
                  <td>₦ {asset.purchasePrice.toFixed(2)}</td>
                  <td>₦ {asset.currentPrice.toFixed(2)}</td>
                  <td>
                    <div className={`my-assets__performance ${asset.isPositive ? 'positive' : 'negative'}`}>
                      {asset.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                      {asset.isPositive ? '+' : ''}{asset.performance}%
                    </div>
                  </td>
                  <td>
                    <button 
                      className="my-assets__action-btn"
                      onClick={(e) => handleSellClick(asset, e)}
                    >
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="my-assets__pagination">
          <button className="my-assets__page-btn active">1</button>
          <button className="my-assets__page-btn">2</button>
          <button className="my-assets__page-btn">3</button>
          <span className="my-assets__page-dots">...</span>
          <button className="my-assets__page-btn">30</button>
          <button className="my-assets__page-btn my-assets__page-btn--next">Next</button>
        </div>
      </div>

      {showSellModal && (
        <SellModal
          asset={selectedAsset}
          onClose={() => {
            setShowSellModal(false)
            setSelectedAsset(null)
          }}
        />
      )}
    </div>
  )
}

export default MyAssets
