import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, User, Check } from 'lucide-react'
import SellModal from '../../components/SellModal'
import mainImage from '../../assets/sletedmarketimagemain.png'
import selectedImage1 from '../../assets/selectedmarketimage1.png'
import selectedImage2 from '../../assets/selectedmarketimage2.png'
import './AssetDetails.css'

const AssetDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [selectedImage, setSelectedImage] = useState(0)
  const [showSellModal, setShowSellModal] = useState(false)

  const asset = {
    name: 'TokenArt Treasures',
    collection: 'Proper Token',
    value: '600.67 USDT',
    currentPrice: '280.50 SOL (12%)',
    images: [mainImage, selectedImage1, selectedImage2],
    description: '2 Bed apartment in the heart of Maitama Abuja in a perfect location for investment providing income returns that offset RESERVE Treasured, within easy reach the City centre.',
    assetName: 'Proper Token',
    tokenType: 'PT',
    standard: 'Arbitrum - Layibet',
    bedrooms: 4,
    baths: 'Hadone',
    totalVolume: '1,140.94D',
    dateCreated: 'July, 2024',
    marketcap: '6k',
    maxSupply: '10%',
    nft: {
      tokenName: 'Lanfriq Property Token',
      tokenId: 'LNFQ NFT -1325',
      description: 'Polygon',
      smartContract: '0x1d5C...fd2c',
      printDate: 'November 2, 2025',
      valuation: '500.14k',
      status: 'Active'
    },
    activity: [
      { user: 'Baskey Koer', action: 'Brought by Baskey Koer', date: 'Nov 2nd, 2025', amount: '$40.02', tokens: '12x' },
      { user: 'Baskey Koer', action: 'Brought by Baskey Koer', date: 'Nov 2nd, 2025', amount: '$40.02', tokens: '12x' },
      { user: 'Baskey Koer', action: 'Asset created by Baskey Koer', date: 'Nov 21st, 2025', amount: null, tokens: null }
    ],
    owners: [
      { name: 'Baskey', wallet: '0x1d5K...1PGF', percentage: '12%', amount: '12.31 USDT' },
      { name: 'Uzodia', wallet: '0x1d5...1PGF', percentage: '19%', amount: '17.31 USDT' },
      { name: 'Baskey', wallet: '0x1d5K...1PGF', percentage: '12%', amount: '12.31 USDT' }
    ]
  }

  const handleSellClick = () => {
    setShowSellModal(true)
  }

  return (
    <div className="asset-details">
      <button className="asset-details__back" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        Asset / Asset details
      </button>

      <div className="asset-details__grid">
        {/* Left Column */}
        <div className="asset-details__left">
          {/* Header Info */}
          <div className="asset-details__header">
            <div className="asset-details__avatar">
              <img src={asset.images[0]} alt={asset.name} />
            </div>
            <div className="asset-details__header-info">
              <h1 className="asset-details__title">
                {asset.name} <Check size={20} className="asset-details__verified" />
              </h1>
              <div className="asset-details__value">Value: {asset.value}</div>
              <p className="asset-details__description">{asset.description}</p>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="asset-details__image-gallery">
            <div className="asset-details__main-image">
              <img src={asset.images[selectedImage]} alt={asset.name} />
            </div>
            <div className="asset-details__thumbnails">
              {asset.images.map((img, index) => (
                <div
                  key={index}
                  className={`asset-details__thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={img} alt={`View ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Activity & Price History Row */}
          <div className="asset-details__row">
            <div className="asset-details__section asset-details__section--half">
              <h3 className="asset-details__section-title">Activity</h3>
              <div className="asset-details__activity">
                {asset.activity.map((item, index) => (
                  <div key={index} className="asset-details__activity-item">
                    <User size={20} />
                    <div className="asset-details__activity-info">
                      <p className="asset-details__activity-text">{item.action}</p>
                      <p className="asset-details__activity-date">{item.date}</p>
                    </div>
                    {item.amount && <span className="asset-details__activity-amount">{item.amount}</span>}
                    {item.tokens && <span className="asset-details__activity-tokens">{item.tokens}</span>}
                  </div>
                ))}
              </div>
            </div>

            {/* Price History */}
            <div className="asset-details__section asset-details__section--half">
              <h3 className="asset-details__section-title">
                Price History 
                <span className="asset-details__timeframe">2024</span>
              </h3>
              <div className="asset-details__chart">
                <div className="asset-details__chart-labels">
                  <span>$30k</span>
                  <span>$25k</span>
                  <span>$20k</span>
                  <span>$15k</span>
                  <span>$10k</span>
                </div>
                <div className="asset-details__chart-content">
                  <svg viewBox="0 0 600 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8cc043" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#8cc043" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path 
                      d="M 0,120 L 80,100 L 160,110 L 240,90 L 320,100 L 400,70 L 480,85 L 560,60 L 600,50"
                      fill="none"
                      stroke="#8cc043"
                      strokeWidth="2.5"
                    />
                    <path 
                      d="M 0,120 L 80,100 L 160,110 L 240,90 L 320,100 L 400,70 L 480,85 L 560,60 L 600,50 L 600,200 L 0,200 Z"
                      fill="url(#priceGradient)"
                    />
                  </svg>
                  <div className="asset-details__chart-months">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span className="active">Jun</span>
                    <span>Jul</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* NFT Metadata & Owners Row */}
          <div className="asset-details__row">
            <div className="asset-details__section asset-details__section--half">
              <h3 className="asset-details__section-title">
                NFT Metadata 
                <span className="asset-details__view-all">View All</span>
              </h3>
              <table className="asset-details__nft-table">
                <tbody>
                  <tr>
                    <td>Token Name</td>
                    <td>{asset.nft.tokenName}</td>
                  </tr>
                  <tr>
                    <td>Token ID</td>
                    <td>{asset.nft.tokenId}</td>
                  </tr>
                  <tr>
                    <td>Description</td>
                    <td>{asset.nft.description}</td>
                  </tr>
                  <tr>
                    <td>Smart Contract</td>
                    <td>{asset.nft.smartContract}</td>
                  </tr>
                  <tr>
                    <td>Print Date</td>
                    <td>{asset.nft.printDate}</td>
                  </tr>
                  <tr>
                    <td>Metadata</td>
                    <td className="asset-details__status-active">JSON</td>
                  </tr>
                  <tr>
                    <td>Status</td>
                    <td><span className="asset-details__status-badge">{asset.nft.status}</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Owners */}
            <div className="asset-details__section asset-details__section--half">
              <h3 className="asset-details__section-title">
                Owners 
                <span className="asset-details__total-owners">200.50 HBAR</span>
              </h3>
              <div className="asset-details__owners-list">
                {asset.owners.map((owner, index) => (
                  <div key={index} className="asset-details__owner-item">
                    <div className="asset-details__owner-avatar">{index + 1}</div>
                    <div className="asset-details__owner-info">
                      <div className="asset-details__owner-name">{owner.name}</div>
                      <div className="asset-details__owner-wallet">{owner.wallet}</div>
                    </div>
                    <div className="asset-details__owner-stats">
                      <div className="asset-details__owner-percentage">{owner.percentage}</div>
                      <div className="asset-details__owner-amount">{owner.amount}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="asset-details__right">
          <div className="asset-details__price-card">
            <div className="asset-details__price-circle">
              <svg viewBox="0 0 200 200">
                <defs>
                  <linearGradient id="circleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8cc043" />
                    <stop offset="100%" stopColor="#6a9834" />
                  </linearGradient>
                </defs>
                <circle cx="100" cy="100" r="85" fill="none" stroke="rgba(140, 192, 67, 0.1)" strokeWidth="15" />
                <circle 
                  cx="100" 
                  cy="100" 
                  r="85" 
                  fill="none" 
                  stroke="url(#circleGradient)" 
                  strokeWidth="15"
                  strokeDasharray="200 534"
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                />
              </svg>
              <div className="asset-details__price-content">
                <div className="asset-details__price-label">Current</div>
                <div className="asset-details__price-value">{asset.currentPrice}</div>
              </div>
            </div>
            <button className="asset-details__bid-btn" onClick={handleSellClick}>
              Bid Now
            </button>
          </div>

          <div className="asset-details__info-card">
            <div className="asset-details__info-row">
              <span>Asset name</span>
              <strong>{asset.assetName}</strong>
            </div>
            <div className="asset-details__info-row">
              <span>Token type</span>
              <strong>{asset.tokenType}</strong>
            </div>
            <div className="asset-details__info-row">
              <span>Standard</span>
              <strong>{asset.standard}</strong>
            </div>
            <div className="asset-details__info-row">
              <span>Bedrooms</span>
              <strong>{asset.bedrooms}</strong>
            </div>
            <div className="asset-details__info-row">
              <span>Baths</span>
              <strong>{asset.baths}</strong>
            </div>
            <div className="asset-details__info-row">
              <span>Total volume</span>
              <strong>{asset.totalVolume}</strong>
            </div>
            <div className="asset-details__info-row">
              <span>Date created</span>
              <strong>{asset.dateCreated}</strong>
            </div>
            <div className="asset-details__info-row">
              <span>Marketcap</span>
              <strong>{asset.marketcap}</strong>
            </div>
            <div className="asset-details__info-row">
              <span>Max supply</span>
              <strong>{asset.maxSupply}</strong>
            </div>
          </div>
        </div>
      </div>

      {showSellModal && (
        <SellModal
          asset={{ ...asset, id, tokenNo: 10 }}
          onClose={() => setShowSellModal(false)}
        />
      )}
    </div>
  )
}

export default AssetDetails
