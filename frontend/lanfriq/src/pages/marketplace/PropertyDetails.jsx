import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, User } from 'lucide-react'
import BuyTokenModal from '../../components/modals/BuyTokenModal'
import selectedImage1 from '../../assets/selectedmarketimage1.png'
import selectedImage2 from '../../assets/selectedmarketimage2.png'
import mainImage from '../../assets/sletedmarketimagemain.png'
import './PropertyDetails.css'

const PropertyDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  const property = {
    name: 'TokenArt Treasures',
    value: '500.07 USDT',
    days: 10,
    hours: 2,
    mins: 49,
    secs: 15,
    images: [mainImage, selectedImage1, selectedImage2],
    available: '220.07 USDT (48%)',
    asset: 'Lanfriq Property Token',
    type: 'PT',
    standard: 'Arbitrum - Layibet',
    bedrooms: 4,
    baths: 12,
    totalVolume: '1,140.94D',
    dateCreated: 'July, 2024',
    marketcap: '6k',
    maxsupply: '10%',
    nft: {
      tokenName: 'Lanfriq Property Token',
      tokenId: 'LNFQ NFT -1325',
      description: 'Polygon',
      smartContract: '0x1d5C...fd2c',
      nftEnds: 'November 2, 2025',
      valuation: '500,14k',
      broker: 'Active'
    },
    owners: [
      { name: 'Afsal', wallet: '0x1d5K...1PGF', tokens: '12.3111DPT' },
      { name: 'Romy', wallet: '0x1d5...1TKF', tokens: '17.3111DPT' },
      { name: 'Koo', wallet: '0x1d5K...1PGF', tokens: '12.3111DPT' }
    ]
  }

  return (
    <div className="property-details">
      <button className="property-details__back" onClick={() => navigate(-1)}>
        <ArrowLeft size={20} />
        Market / Property details
      </button>

      <div className="property-details__grid">
        {/* Left Column */}
        <div className="property-details__left">
          <div className="property-details__image-gallery">
            <div className="property-details__main-image">
              <img src={property.images[selectedImage]} alt={property.name} />
            </div>
            <div className="property-details__thumbnails">
              {property.images.map((img, index) => (
                <div
                  key={index}
                  className={`property-details__thumbnail ${selectedImage === index ? 'active' : ''}`}
                  onClick={() => setSelectedImage(index)}
                >
                  <img src={img} alt={`View ${index + 1}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Activity */}
          <div className="property-details__section">
            <h3 className="property-details__section-title">Activity</h3>
            <div className="property-details__activity">
              <div className="property-details__activity-item">
                <User size={16} />
                <div>
                  <p className="property-details__activity-text">
                    <strong>Brought by Baskey Koer</strong>
                  </p>
                  <p className="property-details__activity-date">Nov 2nd, 2025</p>
                </div>
                <span className="property-details__activity-amount">$40.00</span>
                <span className="property-details__activity-tokens">12x</span>
              </div>
              <div className="property-details__activity-item">
                <User size={16} />
                <div>
                  <p className="property-details__activity-text">
                    <strong>Brought by Baskey Koer</strong>
                  </p>
                  <p className="property-details__activity-date">Nov 2nd, 2025</p>
                </div>
                <span className="property-details__activity-amount">$40.00</span>
                <span className="property-details__activity-tokens">12x</span>
              </div>
              <div className="property-details__activity-item">
                <User size={16} />
                <div>
                  <p className="property-details__activity-text">
                    <strong>Asset created by Bassey Koer</strong>
                  </p>
                  <p className="property-details__activity-date">Nov 8th, 2028</p>
                </div>
              </div>
            </div>
          </div>

          {/* Price History */}
          <div className="property-details__section">
            <h3 className="property-details__section-title">Price History <span className="property-details__timeframe">36kH</span></h3>
            <div className="property-details__chart">
              <div className="property-details__chart-placeholder">
                <svg viewBox="0 0 400 150" className="property-details__chart-svg">
                  <polyline 
                    points="0,100 50,80 100,90 150,60 200,70 250,40 300,50 350,30 400,35"
                    fill="none"
                    stroke="#8cc043"
                    strokeWidth="2"
                  />
                  <polyline 
                    points="0,100 50,80 100,90 150,60 200,70 250,40 300,50 350,30 400,35 400,150 0,150"
                    fill="rgba(140, 192, 67, 0.1)"
                    stroke="none"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* NFT Metadata */}
          <div className="property-details__section">
            <h3 className="property-details__section-title">NFT Marketplace <span className="property-details__view-all">View (1)</span></h3>
            <div className="property-details__metadata">
              <div className="property-details__metadata-row">
                <span>Token Name</span>
                <span>{property.nft.tokenName}</span>
              </div>
              <div className="property-details__metadata-row">
                <span>Token ID</span>
                <span>{property.nft.tokenId}</span>
              </div>
              <div className="property-details__metadata-row">
                <span>Description</span>
                <span>{property.nft.description}</span>
              </div>
              <div className="property-details__metadata-row">
                <span>Smart Contract</span>
                <span>{property.nft.smartContract}</span>
              </div>
              <div className="property-details__metadata-row">
                <span>NFT Ends</span>
                <span>{property.nft.nftEnds}</span>
              </div>
              <div className="property-details__metadata-row">
                <span>Valuation</span>
                <span>{property.nft.valuation}</span>
              </div>
              <div className="property-details__metadata-row">
                <span>Broker</span>
                <span className="property-details__broker-active">{property.nft.broker}</span>
              </div>
            </div>
          </div>

          {/* Owners */}
          <div className="property-details__section">
            <h3 className="property-details__section-title">Owners <span className="property-details__owner-count">200.30 BNBF</span></h3>
            <div className="property-details__owners">
              {property.owners.map((owner, index) => (
                <div key={index} className="property-details__owner-row">
                  <div className="property-details__owner-info">
                    <div className="property-details__owner-avatar">{index + 1}</div>
                    <span>{owner.name}</span>
                  </div>
                  <span className="property-details__owner-wallet">{owner.wallet}</span>
                  <span className="property-details__owner-tokens">{owner.tokens}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="property-details__right">
          <div className="property-details__info-card">
            <h2 className="property-details__title">{property.name}</h2>
            <div className="property-details__value">Value: {property.value}</div>

            {/* Countdown */}
            <div className="property-details__countdown">
              <div className="property-details__countdown-box">
                <span className="property-details__countdown-value">{property.days}</span>
                <span className="property-details__countdown-label">Days</span>
              </div>
              <div className="property-details__countdown-box">
                <span className="property-details__countdown-value">{property.hours}</span>
                <span className="property-details__countdown-label">Hrs</span>
              </div>
              <div className="property-details__countdown-box">
                <span className="property-details__countdown-value">{property.mins}</span>
                <span className="property-details__countdown-label">Mins</span>
              </div>
              <div className="property-details__countdown-box">
                <span className="property-details__countdown-value">{property.secs}</span>
                <span className="property-details__countdown-label">Secs</span>
              </div>
            </div>

            <div className="property-details__available">
              <span>Available</span>
              <span className="property-details__available-value">{property.available}</span>
            </div>

            <button className="property-details__buy-btn" onClick={() => setIsBuyModalOpen(true)}>
              Buy Now
            </button>

            {/* Property Info */}
            <div className="property-details__specs">
              <div className="property-details__spec">
                <span>Asset name:</span>
                <strong>{property.asset}</strong>
              </div>
              <div className="property-details__spec">
                <span>Token type:</span>
                <strong>{property.type}</strong>
              </div>
              <div className="property-details__spec">
                <span>Standard:</span>
                <strong>{property.standard}</strong>
              </div>
              <div className="property-details__spec">
                <span>Bedrooms:</span>
                <strong>{property.bedrooms}</strong>
              </div>
              <div className="property-details__spec">
                <span>Baths:</span>
                <strong>{property.baths}</strong>
              </div>
              <div className="property-details__spec">
                <span>Total volume:</span>
                <strong>{property.totalVolume}</strong>
              </div>
              <div className="property-details__spec">
                <span>Date created:</span>
                <strong>{property.dateCreated}</strong>
              </div>
              <div className="property-details__spec">
                <span>Marketcap:</span>
                <strong>{property.marketcap}</strong>
              </div>
              <div className="property-details__spec">
                <span>Max supply:</span>
                <strong>{property.maxsupply}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BuyTokenModal isOpen={isBuyModalOpen} onClose={() => setIsBuyModalOpen(false)} />
    </div>
  )
}

export default PropertyDetails
