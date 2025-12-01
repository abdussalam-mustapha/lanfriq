import { useState, useEffect } from 'react'
import { X, ArrowLeft } from 'lucide-react'
import { useAccount, useWalletClient } from 'wagmi'
import { ethers } from 'ethers'
import { BrowserProvider } from 'ethers'
import { buyShares } from '../../utils/contractUtils'
import PurchaseSuccessModal from './PurchaseSuccessModal'
import './BuyTokenModal.css'

const BuyTokenModal = ({ isOpen, onClose, propertyId, pricePerShare, listingId }) => {
  const [amount, setAmount] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [isPurchasing, setIsPurchasing] = useState(false)
  const [purchaseError, setPurchaseError] = useState(null)
  const [txHash, setTxHash] = useState(null)
  const minimum = 60
  const maximum = 10000

  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()

  // Calculate countdown from a target end date (e.g., 10 days from now)
  const getInitialEndTime = () => {
    const now = new Date()
    return new Date(now.getTime() + (10 * 24 * 60 * 60 * 1000)) // 10 days from now
  }

  const [endTime] = useState(getInitialEndTime())
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, mins: 0, secs: 0 })

  useEffect(() => {
    if (!isOpen) return

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
  }, [isOpen, endTime])

  const handleBuy = async () => {
    if (!isConnected) {
      setPurchaseError('Please connect your wallet first')
      return
    }

    if (!amount || parseInt(amount) < minimum) {
      setPurchaseError('Please enter a valid amount')
      return
    }

    try {
      setIsPurchasing(true)
      setPurchaseError(null)

      // Convert wallet client to ethers signer
      const provider = new BrowserProvider(walletClient)
      const signer = await provider.getSigner()

      // Check if listing exists first
      const marketplaceContract = await import('../../utils/contractUtils').then(m => m.getMarketplaceContract)
      const marketplace = marketplaceContract(signer)
      
      const listingData = await marketplace.getListing(listingId || 1)
      
      console.log('Listing data:', listingData)
      console.log('Listing structure:', {
        seller: listingData[0] || listingData.seller,
        propertyTokenId: listingData[1] || listingData.propertyTokenId,
        pricePerShare: listingData[2] || listingData.pricePerShare,
        sharesAvailable: listingData[3] || listingData.sharesAvailable,
        paymentToken: listingData[4] || listingData.paymentToken,
        isActive: listingData[5] || listingData.isActive
      })
      
      // Handle both named and indexed return values
      const isActive = listingData.isActive !== undefined ? listingData.isActive : listingData[5]
      const sharesAvailable = listingData.sharesAvailable !== undefined ? listingData.sharesAvailable : listingData[3]
      const listingPricePerShare = listingData.pricePerShare !== undefined ? listingData.pricePerShare : listingData[2]
      
      if (!isActive) {
        setPurchaseError('This listing is no longer active')
        setIsPurchasing(false)
        return
      }
      
      // Calculate shares based on listing's price per share, not property's
      const actualPricePerShareInCAMP = parseFloat(ethers.formatEther(listingPricePerShare))
      const shareCount = Math.floor(parseInt(amount) / actualPricePerShareInCAMP)
      
      console.log('Share calculation:', {
        amount: parseInt(amount),
        actualPricePerShareInCAMP,
        shareCount,
        sharesAvailable: sharesAvailable.toString()
      })
      
      if (shareCount < 1) {
        setPurchaseError(`Amount too small. Minimum needed: ${actualPricePerShareInCAMP} CAMP per share`)
        setIsPurchasing(false)
        return
      }
      
      if (sharesAvailable < shareCount) {
        setPurchaseError(`Only ${sharesAvailable} shares available`)
        setIsPurchasing(false)
        return
      }
      
      // Recalculate total cost using listing's price
      const totalCostInCAMP = shareCount * actualPricePerShareInCAMP
      const totalCost = ethers.parseEther(totalCostInCAMP.toString())
      
      // Extract payment token from listing (handle both formats)
      const paymentToken = listingData.paymentToken !== undefined ? listingData.paymentToken : listingData[4]
      
      // Check if user has sufficient balance
      if (paymentToken === '0x0000000000000000000000000000000000000000' || paymentToken === ethers.ZeroAddress) {
        // Native token payment - check native balance
        const balance = await provider.getBalance(address)
        console.log('Native token balance:', ethers.formatEther(balance), 'Required:', ethers.formatEther(totalCost))
        
        if (balance < totalCost) {
          setPurchaseError(`Insufficient native token balance. You need ${ethers.formatEther(totalCost)} native tokens but only have ${ethers.formatEther(balance)}`)
          setIsPurchasing(false)
          return
        }
      }
      
      console.log('Payment details:', {
        paymentToken,
        totalCost: totalCost.toString(),
        totalCostInCAMP: totalCostInCAMP,
        shareCount,
        listingId,
        isNativePayment: paymentToken === '0x0000000000000000000000000000000000000000' || paymentToken === ethers.ZeroAddress
      })

      // Call smart contract to buy shares
      const receipt = await buyShares(
        signer,
        listingId || 1,
        shareCount,
        totalCost,
        paymentToken // Pass the payment token address from listing
      )

      setTxHash(receipt.hash || receipt.transactionHash)
      setShowSuccess(true)
    } catch (error) {
      console.error('Purchase failed:', error)
      
      // Provide more helpful error messages
      if (error.code === 'CALL_EXCEPTION') {
        setPurchaseError('Transaction failed: The listing may not exist or you may not have sufficient balance')
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        setPurchaseError('Insufficient funds in your wallet')
      } else if (error.code === 'ACTION_REJECTED') {
        setPurchaseError('Transaction was rejected')
      } else if (error.message?.includes('approve')) {
        setPurchaseError('Token approval failed. Please try again.')
      } else if (error.message?.includes('ERC20')) {
        setPurchaseError('Insufficient CAMP token balance or approval failed')
      } else {
        setPurchaseError(error.shortMessage || error.message || 'Transaction failed. Please try again.')
      }
    } finally {
      setIsPurchasing(false)
    }
  }

  const handleSuccessClose = () => {
    setShowSuccess(false)
    setAmount('')
    setPurchaseError(null)
    setTxHash(null)
    onClose()
  }

  if (!isOpen) return null

  if (showSuccess) {
    return <PurchaseSuccessModal isOpen={showSuccess} onClose={handleSuccessClose} txHash={txHash} />
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
              disabled={isPurchasing}
            />
            <div className="buy-token__receive">
              <span>You receive: {amount ? Math.floor(parseInt(amount) / (pricePerShare || 100)).toLocaleString() : '0'} shares</span>
              <button className="buy-token__max" onClick={() => setAmount(maximum.toString())} disabled={isPurchasing}>
                Max
              </button>
            </div>
          </div>

          {/* Error Message */}
          {purchaseError && (
            <div className="buy-token__error">
              {purchaseError}
            </div>
          )}

          {/* Wallet Warning */}
          {!isConnected && (
            <div className="buy-token__warning">
              Please connect your wallet to purchase tokens
            </div>
          )}

          {/* Buy Button */}
          <button 
            className="buy-token__buy-btn" 
            onClick={handleBuy}
            disabled={isPurchasing || !isConnected}
          >
            {isPurchasing ? 'Processing...' : 'Buy now'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default BuyTokenModal
