import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, User } from 'lucide-react'
import { useAccount, usePublicClient } from 'wagmi'
import { ethers } from 'ethers'
import { getProperty, getActiveListings } from '../../utils/contractUtils'
import BuyTokenModal from '../../components/modals/BuyTokenModal'
import selectedImage1 from '../../assets/selectedmarketimage1.png'
import selectedImage2 from '../../assets/selectedmarketimage2.png'
import mainImage from '../../assets/sletedmarketimagemain.png'
import './PropertyDetails.css'

const PropertyDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { address, isConnected } = useAccount()
  const publicClient = usePublicClient()
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [blockchainProperty, setBlockchainProperty] = useState(null)
  const [listingId, setListingId] = useState(null)

  // Calculate countdown from a target end date (e.g., 10 days from now)
  const getInitialEndTime = () => {
    const now = new Date()
    return new Date(now.getTime() + (10 * 24 * 60 * 60 * 1000)) // 10 days from now
  }

  const [endTime] = useState(getInitialEndTime())
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })

  // Fetch property from blockchain
  useEffect(() => {
    const fetchBlockchainProperty = async () => {
      if (!publicClient) return
      
      try {
        setLoading(true)
        // Try to fetch property with tokenId = id from URL
        const provider = new ethers.JsonRpcProvider(publicClient.transport.url)
        const propertyData = await getProperty(provider, id)
        
        console.log('Fetched property from blockchain:', propertyData)
        
        if (propertyData && propertyData.owner !== ethers.ZeroAddress) {
          setBlockchainProperty({
            owner: propertyData.owner,
            propertyAddress: propertyData.propertyAddress,
            valuation: ethers.formatEther(propertyData.valuation),
            totalShares: propertyData.totalShares.toString(),
            availableShares: propertyData.availableShares.toString(),
            pricePerShare: ethers.formatEther(propertyData.pricePerShare),
            isVerified: propertyData.isVerified
          })
          
          // Find the listing ID for this property
          const listings = await getActiveListings(provider, 50)
          const propertyListing = listings.find(l => l.propertyTokenId.toString() === id)
          if (propertyListing) {
            setListingId(propertyListing.listingId)
            console.log('Found listing ID:', propertyListing.listingId)
          }
        }
      } catch (error) {
        console.log('No blockchain property found, using demo data:', error.message)
      } finally {
        setLoading(false)
      }
    }

    fetchBlockchainProperty()
  }, [id, publicClient])

  useEffect(() => {
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
  }, [endTime])

  const property = {
    name: blockchainProperty ? `Property #${id}` : 'TokenArt Treasures',
    value: blockchainProperty ? `${blockchainProperty.valuation} CAMP` : '500.07 USDT',
    images: [mainImage, selectedImage1, selectedImage2],
    available: blockchainProperty 
      ? `${blockchainProperty.availableShares} of ${blockchainProperty.totalShares} shares (${Math.round((parseInt(blockchainProperty.availableShares) / parseInt(blockchainProperty.totalShares)) * 100)}%)`
      : '220.07 USDT (48%)',
    asset: blockchainProperty ? `Property Token #${id}` : 'Lanfriq Property Token',
    type: 'PT',
    standard: 'Camp Network - Basecamp',
    bedrooms: 4,
    baths: 12,
    totalVolume: blockchainProperty ? `${blockchainProperty.valuation} CAMP` : '1,140.94D',
    dateCreated: 'July, 2024',
    marketcap: blockchainProperty ? `${(parseFloat(blockchainProperty.valuation) * 0.01).toFixed(2)}k` : '6k',
    maxsupply: blockchainProperty ? blockchainProperty.totalShares : '10%',
    pricePerShare: blockchainProperty ? blockchainProperty.pricePerShare : '500',
    nft: {
      tokenName: blockchainProperty ? `Property Token #${id}` : 'Lanfriq Property Token',
      tokenId: `LNFQ NFT-${id}`,
      description: 'Camp Network',
      smartContract: import.meta.env.VITE_PROPERTY_NFT_ADDRESS?.substring(0, 8) + '...' + import.meta.env.VITE_PROPERTY_NFT_ADDRESS?.substring(38) || '0x1d5C...fd2c',
      nftEnds: 'November 2, 2025',
      valuation: blockchainProperty ? `${blockchainProperty.valuation} CAMP` : '500,14k',
      broker: blockchainProperty?.isVerified ? 'Verified' : 'Pending',
      owner: blockchainProperty?.owner
    },
    owners: [
      { name: 'Owner', wallet: blockchainProperty?.owner?.substring(0, 6) + '...' + blockchainProperty?.owner?.substring(38) || '0x1d5K...1PGF', tokens: `${blockchainProperty?.totalShares || '12.3111'} Shares` }
    ]
  }

  if (loading) {
    return (
      <div className="property-details">
        <button className="property-details__back" onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
          Market / Property details
        </button>
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Loading property data...
        </div>
      </div>
    )
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

          {/* Activity & Financials Row */}
          <div className="property-details__row">
            <div className="property-details__section property-details__section--half">
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

            {/* Financials */}
            <div className="property-details__section property-details__section--half">
              <h3 className="property-details__section-title">Financials <span className="property-details__timeframe">2024</span></h3>
              <div className="property-details__chart">
                <div className="property-details__chart-labels">
                  <span>40</span>
                  <span>30</span>
                  <span>20</span>
                  <span>10</span>
                  <span>0</span>
                </div>
                <div className="property-details__chart-content">
                  <svg viewBox="0 0 600 200" className="property-details__chart-svg" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#8cc043" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#8cc043" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path 
                      d="M 0,120 L 60,100 L 120,110 L 180,90 L 240,100 L 300,70 L 360,85 L 420,60 L 480,75 L 540,55 L 600,50"
                      fill="none"
                      stroke="#8cc043"
                      strokeWidth="2.5"
                    />
                    <path 
                      d="M 0,120 L 60,100 L 120,110 L 180,90 L 240,100 L 300,70 L 360,85 L 420,60 L 480,75 L 540,55 L 600,50 L 600,200 L 0,200 Z"
                      fill="url(#chartGradient)"
                    />
                  </svg>
                  <div className="property-details__chart-months">
                    <span>Jan</span>
                    <span>Feb</span>
                    <span>Mar</span>
                    <span>Apr</span>
                    <span>May</span>
                    <span className="property-details__chart-month--active">Jun</span>
                    <span>Jul</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* NFT Metadata & Investors Row */}
          <div className="property-details__row">
            <div className="property-details__section property-details__section--half">
              <h3 className="property-details__section-title">NFT Metadata <span className="property-details__view-all">View NFT</span></h3>
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

            {/* Investors */}
            <div className="property-details__section property-details__section--half">
              <h3 className="property-details__section-title">Investors <span className="property-details__owner-count">200.50 HBAR</span></h3>
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
        </div>

        {/* Right Column */}
        <div className="property-details__right">
          <div className="property-details__info-card">
            <h2 className="property-details__title">{property.name}</h2>
            <div className="property-details__value">Value: {property.value}</div>

            {/* Countdown */}
            <div className="property-details__countdown">
              <div className="property-details__countdown-box">
                <span className="property-details__countdown-value">{countdown.days}</span>
                <span className="property-details__countdown-label">Days</span>
              </div>
              <div className="property-details__countdown-box">
                <span className="property-details__countdown-value">{countdown.hours}</span>
                <span className="property-details__countdown-label">Hrs</span>
              </div>
              <div className="property-details__countdown-box">
                <span className="property-details__countdown-value">{countdown.mins}</span>
                <span className="property-details__countdown-label">Mins</span>
              </div>
              <div className="property-details__countdown-box">
                <span className="property-details__countdown-value">{countdown.secs}</span>
                <span className="property-details__countdown-label">Secs</span>
              </div>
            </div>

            <div className="property-details__available">
              <span>Available</span>
              <span className="property-details__available-value">{property.available}</span>
            </div>

            <div className={`property-details__demo-notice ${blockchainProperty ? 'property-details__demo-notice--verified' : ''}`}>
              <small>
                {blockchainProperty 
                  ? `✓ Real property from blockchain (Token ID: ${id})` 
                  : 'Note: This is a demo property. Create real properties via the Tokenization Hub.'}
              </small>
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

      <BuyTokenModal 
        isOpen={isBuyModalOpen} 
        onClose={() => setIsBuyModalOpen(false)}
        propertyId={id}
        pricePerShare={parseFloat(property.pricePerShare)}
        listingId={listingId || id}
      />
    </div>
  )
}

export default PropertyDetails
