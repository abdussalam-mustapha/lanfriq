import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, CheckCircle, AlertCircle } from 'lucide-react'
import { usePublicClient } from 'wagmi'
import { ethers } from 'ethers'
import { getActiveListings, getAllProperties } from '../../utils/contractUtils'
import marketplaceimage from '../../assets/marketplaceimage.png'
import './Marketplace.css'

const Marketplace = () => {
  const navigate = useNavigate()
  const publicClient = usePublicClient()
  
  const [properties, setProperties] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  
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

  // Fetch real listings from blockchain
  useEffect(() => {
    const fetchListings = async () => {
      if (!publicClient) return
      
      try {
        setIsLoading(true)
        const provider = new ethers.JsonRpcProvider(publicClient.transport.url)
        
        console.log('Fetching all properties from blockchain...')
        
        // Get all minted properties
        const allProperties = await getAllProperties(provider, 50)
        console.log('Found properties:', allProperties.length, allProperties)
        
        // Get all active listings
        const activeListings = await getActiveListings(provider, 50)
        console.log('Found active listings:', activeListings.length, activeListings)
        
        // Create a map of tokenId to listing for quick lookup
        const listingMap = new Map()
        activeListings.forEach(listing => {
          // listing structure: [seller, propertyTokenId, pricePerShare, sharesAvailable, paymentToken, isActive, timestamp]
          const tokenId = listing[1] || listing.propertyTokenId
          listingMap.set(tokenId.toString(), listing)
        })
        
        // Map properties to display format
        const propertiesWithDetails = allProperties.map((property) => {
          const listing = listingMap.get(property.tokenId.toString())
          const hasListing = !!listing
          
          console.log(`Property ${property.tokenId}:`, {
            hasListing,
            listing: listing ? 'yes' : 'no',
            propertyAddress: property.propertyAddress || property[1]
          })
          
          // Extract property data - handle both named and indexed returns
          const propertyOwner = property.owner || property[0]
          const propertyAddress = property.propertyAddress || property[1]
          const valuation = property.valuation || property[2]
          const totalShares = property.totalShares || property[3]
          const availableShares = property.availableShares || property[4]
          const pricePerShare = property.pricePerShare || property[5]
          const isVerified = property.isVerified || property[6]
          
          // Extract listing data if exists
          let listingPricePerShare = pricePerShare
          let listingSharesAvailable = availableShares
          
          if (listing) {
            listingPricePerShare = listing.pricePerShare || listing[2]
            listingSharesAvailable = listing.sharesAvailable || listing[3]
          }
          
          return {
            id: property.tokenId.toString(),
            tokenId: property.tokenId.toString(),
            listingId: listing?.listingId,
            name: propertyAddress || `Property #${property.tokenId}`,
            image: marketplaceimage,
            value: `${ethers.formatEther(valuation)} CAMP`,
            pricePerShare: ethers.formatEther(listingPricePerShare),
            sharesAvailable: listingSharesAvailable.toString(),
            totalShares: totalShares.toString(),
            owner: `${propertyOwner.slice(0, 6)}...${propertyOwner.slice(-4)}`,
            ownerAddress: propertyOwner,
            isVerified: isVerified,
            isBlockchain: true,
            hasListing: hasListing,
            isActive: listing ? (listing.isActive || listing[5]) : false
          }
        })
        
        console.log('Setting properties:', propertiesWithDetails)
        setProperties(propertiesWithDetails)
        
      } catch (error) {
        console.error('Error fetching listings:', error)
        console.error('Error details:', error.message, error.stack)
        // If fetching fails, show empty state or keep demo data
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchListings()
  }, [publicClient])

  const featuredProperty = {
    name: 'TokenArt Treasures',
    image: marketplaceimage,
    value: '500.07 CAMP'
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
        {isLoading ? (
          <div className="marketplace__loading">Loading properties...</div>
        ) : properties.length === 0 ? (
          <div className="marketplace__empty">
            <p>No active listings yet. Be the first to list a property!</p>
          </div>
        ) : (
          properties.map((property) => (
            <div 
              key={property.id} 
              className="marketplace__card"
              onClick={() => {
                if (property.hasListing) {
                  navigate(`/marketplace/property/${property.tokenId}`)
                }
              }}
              style={{ cursor: property.hasListing ? 'pointer' : 'default' }}
            >
              <div className="marketplace__card-image-wrapper">
                <img src={property.image} alt={property.name} className="marketplace__card-image" />
                <button className="marketplace__card-favorite" onClick={(e) => e.stopPropagation()}>
                  <Heart size={18} />
                </button>
                {property.isBlockchain && (
                  <div className="marketplace__card-badge">On-Chain</div>
                )}
                {!property.hasListing && (
                  <div className="marketplace__card-badge marketplace__card-badge--unlisted">
                    Not Listed
                  </div>
                )}
              </div>
              
              <div className="marketplace__card-content">
                <div className="marketplace__card-header">
                  <h3 className="marketplace__card-title">
                    {property.name}
                    {property.isVerified && (
                      <CheckCircle size={14} className="marketplace__card-verified" />
                    )}
                  </h3>
                  {property.sharesAvailable && (
                    <div className="marketplace__card-shares">
                      {property.sharesAvailable} / {property.totalShares} shares
                    </div>
                  )}
                </div>
                
                {!property.hasListing && (
                  <div className="marketplace__card-notice">
                    <AlertCircle size={14} />
                    <span>This property needs to be listed on the marketplace. Visit the NFT page to create a listing.</span>
                  </div>
                )}
                
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
                {property.pricePerShare && property.hasListing && (
                  <div className="marketplace__card-price">
                    {property.pricePerShare} CAMP per share
                  </div>
                )}
                {!property.hasListing && (
                  <button 
                    className="marketplace__list-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate('/nft')
                    }}
                  >
                    List Property
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Marketplace
