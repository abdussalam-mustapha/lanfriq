import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, CheckCircle } from 'lucide-react'
import marketplaceimage from '../../assets/marketplaceimage.png'
import './Marketplace.css'

const Marketplace = () => {
  const navigate = useNavigate()
  
  // Calculate countdown from a target end date (e.g., 10 days from now)
  const getInitialEndTime = () => {
    const now = new Date()
    return new Date(now.getTime() + (10 * 24 * 60 * 60 * 1000)) // 10 days from now
  }

  const [endTime] = useState(getInitialEndTime())
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })

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
  
  const [properties] = useState([
    {
      id: 1,
      name: 'BlockWealth Assets',
      image: marketplaceimage,
      value: '200,102 SOL',
      owner: '0x1d5F...9fBo',
      isVerified: true
    },
    {
      id: 2,
      name: 'BlockWealth Assets',
      image: marketplaceimage,
      value: '200,102 SOL',
      owner: '0x1d5F...9fBo',
      isVerified: true
    },
    {
      id: 3,
      name: 'BlockWealth Assets',
      image: marketplaceimage,
      value: '200,102 SOL',
      owner: '0x1d5F...9fBo',
      isVerified: true
    },
    {
      id: 4,
      name: 'BlockWealth Assets',
      image: marketplaceimage,
      value: '200,102 SOL',
      owner: '0x1d5F...9fBo',
      isVerified: true
    },
    {
      id: 5,
      name: 'BlockWealth Assets',
      image: marketplaceimage,
      value: '200,102 SOL',
      owner: '0x1d5F...9fBo',
      isVerified: true
    },
    {
      id: 6,
      name: 'BlockWealth Assets',
      image: marketplaceimage,
      value: '200,102 SOL',
      owner: '0x1d5F...9fBo',
      isVerified: true
    }
  ])

  const featuredProperty = {
    name: 'TokenArt Treasures',
    image: marketplaceimage,
    value: '500.07 USDT'
  }

  return (
    <div className="marketplace">
      <div className="marketplace__header">
        <h1 className="marketplace__title">Market</h1>
        <p className="marketplace__subtitle">
          Discover verified real estate opportunities across Africa with blockchain-backed trust.
        </p>
      </div>

      {/* Featured Property */}
      <div className="marketplace__featured" onClick={() => navigate('/marketplace/property/1')}>
        <div className="marketplace__featured-content">
          <div className="marketplace__featured-info">
            <div className="marketplace__featured-header">
              <img src={marketplaceimage} alt={featuredProperty.name} className="marketplace__featured-thumb" />
              <div>
                <div className="marketplace__featured-name">
                  {featuredProperty.name}
                  <CheckCircle size={16} className="marketplace__verified-icon" />
                </div>
                <div className="marketplace__featured-value">Value: {featuredProperty.value}</div>
              </div>
            </div>

            <div className="marketplace__featured-timer">
              <div className="marketplace__timer-box">
                <div className="marketplace__timer-value">{countdown.days}</div>
                <div className="marketplace__timer-label">Days</div>
              </div>
              <div className="marketplace__timer-box">
                <div className="marketplace__timer-value">{countdown.hours}</div>
                <div className="marketplace__timer-label">hrs</div>
              </div>
              <div className="marketplace__timer-box">
                <div className="marketplace__timer-value">{countdown.mins}</div>
                <div className="marketplace__timer-label">mins</div>
              </div>
              <div className="marketplace__timer-box">
                <div className="marketplace__timer-value">{countdown.secs}</div>
                <div className="marketplace__timer-label">secs</div>
              </div>
            </div>
          </div>

          <button className="marketplace__buy-btn">Buy Now</button>
        </div>
      </div>

      {/* Property Grid */}
      <div className="marketplace__grid">
        {properties.map((property) => (
          <div 
            key={property.id} 
            className="marketplace__card"
            onClick={() => navigate(`/marketplace/property/${property.id}`)}
          >
            <div className="marketplace__card-image-wrapper">
              <img src={property.image} alt={property.name} className="marketplace__card-image" />
              <button className="marketplace__card-favorite">
                <Heart size={18} />
              </button>
            </div>
            
            <div className="marketplace__card-content">
              <div className="marketplace__card-header">
                <h3 className="marketplace__card-title">
                  {property.name}
                  {property.isVerified && (
                    <CheckCircle size={14} className="marketplace__card-verified" />
                  )}
                </h3>
              </div>
              
              <div className="marketplace__card-footer">
                <div className="marketplace__card-owner">
                  <div className="marketplace__card-owner-avatar"></div>
                  <span>{property.owner}</span>
                  {property.isVerified && (
                    <CheckCircle size={12} className="marketplace__owner-verified" />
                  )}
                </div>
                <div className="marketplace__card-value">{property.value}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Marketplace
