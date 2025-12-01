import { useState } from 'react'
import { Eye, BarChart3, Coins, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCamp } from '../../context/CampContext'
import { useAccount, useWalletClient } from 'wagmi'
import { ethers } from 'ethers'
import { BrowserProvider } from 'ethers'
import { 
  mintPropertyIPNFT, 
  createPropertyLicenseTerms,
  DEFAULT_LICENSE_TERMS 
} from '../../utils/campUtils'
import { mintPropertyNFT } from '../../utils/contractUtils'
import PropertySubmissionModal from '../../components/modals/PropertySubmissionModal'
import VerificationFeeModal from '../../components/modals/VerificationFeeModal'
import PropertySubmittedModal from '../../components/modals/PropertySubmittedModal'
import SPVSetupModal from '../../components/modals/SPVSetupModal'
import SuccessModal from '../../components/modals/SuccessModal'
import TokenSetupScreen from '../../components/modals/TokenSetupScreen'
import './TokenizationHub.css'

const TokenizationHub = () => {
  const navigate = useNavigate()
  const [showModal, setShowModal] = useState(false)
  const [showFeeModal, setShowFeeModal] = useState(false)
  const [showSubmittedModal, setShowSubmittedModal] = useState(false)
  const [showSPVModal, setShowSPVModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showTokenSetup, setShowTokenSetup] = useState(false)
  const [assetImage, setAssetImage] = useState(null)
  const [propertyData, setPropertyData] = useState(null)
  const [mintingProgress, setMintingProgress] = useState(0)
  const [isMinting, setIsMinting] = useState(false)
  const [mintedTokenId, setMintedTokenId] = useState(null)
  const [mintedPropertyNFTId, setMintedPropertyNFTId] = useState(null)

  const { origin, isAuthenticated } = useCamp()
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()

  const spvData = [
    { name: 'Additech - Digital', type: 'Real - Estate', value: '$10,000', status: 'Pending' },
    { name: 'Jays - Investment', type: 'Real - Estate', value: '$10,000', status: 'Approved' }
  ]

  const handlePropertySubmit = (formData, teamMembers) => {
    // Store asset image for token setup
    if (formData.assetImage) {
      const imageUrl = URL.createObjectURL(formData.assetImage)
      setAssetImage(imageUrl)
    }
    
    // Store property data for later minting
    setPropertyData({ formData, teamMembers })
    
    console.log('Property submitted:', formData, teamMembers)
    setShowModal(false)
    setShowFeeModal(true)
  }

  const handlePayment = async (txHash) => {
    console.log('handlePayment called with txHash:', txHash)
    
    // Store transaction hash with property data
    if (propertyData) {
      const updatedData = {
        ...propertyData,
        verificationTxHash: txHash,
        verificationPaid: true,
        verificationPaidAt: new Date().toISOString(),
      }
      setPropertyData(updatedData)
      console.log('Property data updated:', updatedData)
    }
    
    console.log('Closing fee modal, opening submitted modal')
    setShowFeeModal(false)
    setShowSubmittedModal(true)
  }

  const handleViewStatus = () => {
    setShowSubmittedModal(false)
    setShowSPVModal(true)
  }

  const handleBrowseMarket = () => {
    setShowSubmittedModal(false)
    navigate('/marketplace')
  }

  const handleGenerateSPV = () => {
    setShowSPVModal(false)
    setShowSuccessModal(true)
  }

  const handleContinueToToken = () => {
    setShowSuccessModal(false)
    setShowTokenSetup(true)
  }

  const handlePublish = async (tokenData) => {
    // Check if wallet is connected via wagmi
    if (!address || !walletClient) {
      alert('Please connect your wallet first')
      return
    }

    if (!propertyData) {
      alert('Property data not found')
      return
    }

    // For now, skip IPNFT minting if Camp Network is not available
    // and only mint PropertyNFT
    if (!origin) {
      console.warn('Camp Network Origin not available, skipping IPNFT minting');
      // Proceed with only PropertyNFT minting
      try {
        setIsMinting(true)
        setMintingProgress(0)

        // Convert walletClient to ethers signer
        const provider = new BrowserProvider(walletClient)
        const signer = await provider.getSigner()

        setMintingProgress(50)

        // Mint only PropertyNFT with a placeholder URI
        const { tokenId: propertyNFTId } = await mintPropertyNFT(signer, {
          to: address,
          address: propertyData.formData.location || 'Property Address',
          valuation: ethers.parseEther(propertyData.formData.valuation || '100000'),
          totalShares: parseInt(tokenData.tokenSupply) || 1000,
          pricePerShare: ethers.parseEther(tokenData.tokenPrice || '100'),
          uri: `ipfs://property/metadata` // Placeholder URI
        })

        setMintedPropertyNFTId(propertyNFTId)
        setMintingProgress(100)

        alert(`Property NFT minted successfully!\nToken ID: ${propertyNFTId}`)
        setShowTokenSetup(false)
      } catch (error) {
        console.error('Error minting PropertyNFT:', error)
        alert(`Failed to mint property: ${error.message}`)
      } finally {
        setIsMinting(false)
        setMintingProgress(0)
      }
      return
    }

    try {
      setIsMinting(true)
      setMintingProgress(0)

      // Create license terms from token data
      const license = createPropertyLicenseTerms({
        price: tokenData.price || "0.001",
        durationDays: tokenData.duration || 30,
        royaltyPercent: tokenData.royalty || 10,
      })

      // Prepare metadata
      const metadata = {
        name: propertyData.formData.propertyName || tokenData.name,
        description: propertyData.formData.description || tokenData.description,
        image: assetImage,
        attributes: [
          { trait_type: 'Type', value: propertyData.formData.propertyType },
          { trait_type: 'Location', value: propertyData.formData.location },
          { trait_type: 'Value', value: propertyData.formData.valuation },
          { trait_type: 'Token Supply', value: tokenData.tokenSupply },
          { trait_type: 'Token Price', value: tokenData.tokenPrice },
        ],
      }

      // Mint IPNFT with progress tracking
      setMintingProgress(30)
      const ipnftTokenId = await mintPropertyIPNFT(
        origin,
        propertyData.formData.assetImage,
        metadata,
        license,
        [], // No parents for now, can be configured for derivatives
        (progress) => setMintingProgress(30 + progress * 0.4) // 30-70% for IPNFT
      )

      setMintedTokenId(ipnftTokenId)
      console.log('IPNFT minted successfully! Token ID:', ipnftTokenId)
      
      // Now mint PropertyNFT contract
      setMintingProgress(70)
      if (!walletClient) {
        throw new Error('Wallet not connected')
      }

      // Convert walletClient to ethers signer
      const provider = new BrowserProvider(walletClient)
      const signer = await provider.getSigner()

      const { tokenId: propertyNFTId } = await mintPropertyNFT(signer, {
        to: address,
        address: propertyData.formData.location || 'Property Address',
        valuation: ethers.parseEther(propertyData.formData.valuation || '100000'),
        totalShares: parseInt(tokenData.tokenSupply) || 1000,
        pricePerShare: ethers.parseEther(tokenData.tokenPrice || '100'),
        uri: `ipfs://ipnft/${ipnftTokenId}` // Link to IPNFT
      })

      setMintedPropertyNFTId(propertyNFTId)
      setMintingProgress(100)
      
      console.log('PropertyNFT minted successfully! Token ID:', propertyNFTId)
      alert(`Success!\nIPNFT ID: ${ipnftTokenId}\nPropertyNFT ID: ${propertyNFTId}`)
      
      setShowTokenSetup(false)
      
      // Reset state
      setPropertyData(null)
      setAssetImage(null)
      
    } catch (error) {
      console.error('Failed to mint IPNFT:', error)
      alert(`Failed to mint IPNFT: ${error.message}`)
    } finally {
      setIsMinting(false)
      setMintingProgress(0)
    }
  }

  return (
    <div className="tokenization-hub">
      <div className="tokenization-hub__header">
        <div className="tokenization-hub__icon">
          <Coins size={24} />
        </div>
        <h1 className="tokenization-hub__title">Asset</h1>
      </div>

      {/* Hero Section */}
      <div className="tokenization-hub__hero">
        <div className="tokenization-hub__hero-content">
          <h2>Create, manage, and monitor your tokenized properties and SPV activities in one place.</h2>
          <button className="tokenization-hub__cta-btn" onClick={() => setShowModal(true)}>
            Create & Tokenize <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Action Cards */}
      <div className="tokenization-hub__cards">
        <div className="tokenization-hub__card">
          <div className="tokenization-hub__card-icon">
            <Eye size={24} />
          </div>
          <div className="tokenization-hub__card-content">
            <h3>See all your SPV here</h3>
            <p>See all the SPV you have created here</p>
          </div>
        </div>
        <div className="tokenization-hub__card">
          <div className="tokenization-hub__card-icon">
            <BarChart3 size={24} />
          </div>
          <div className="tokenization-hub__card-content">
            <h3>SPV Reports</h3>
            <p>See all the SPV reports</p>
          </div>
        </div>
        <div className="tokenization-hub__card">
          <div className="tokenization-hub__card-icon">
            <Coins size={24} />
          </div>
          <div className="tokenization-hub__card-content">
            <h3>Tokenize Assets</h3>
            <p>View all your tokenize assets here</p>
          </div>
        </div>
      </div>

      {/* My SPVs Table */}
      <div className="tokenization-hub__spvs">
        <div className="tokenization-hub__spvs-header">
          <h3>My SPVs</h3>
          <button className="tokenization-hub__filter-btn">
            Filters <span className="tokenization-hub__filter-icon">⚙</span>
          </button>
        </div>
        <table className="tokenization-hub__table">
          <thead>
            <tr>
              <th>SPV Name</th>
              <th>Asset types</th>
              <th>Asset values</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {spvData.map((spv, index) => (
              <tr key={index}>
                <td>{spv.name}</td>
                <td>{spv.type}</td>
                <td>{spv.value}</td>
                <td>
                  <span className={`tokenization-hub__status tokenization-hub__status--${spv.status.toLowerCase()}`}>
                    {spv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* All Modals */}
      <PropertySubmissionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handlePropertySubmit}
      />

      <VerificationFeeModal
        isOpen={showFeeModal}
        onClose={() => setShowFeeModal(false)}
        onPayment={handlePayment}
        recipientAddress={import.meta.env.VITE_PLATFORM_WALLET_ADDRESS}
      />

      <PropertySubmittedModal
        isOpen={showSubmittedModal}
        onViewStatus={handleViewStatus}
        onBrowseMarket={handleBrowseMarket}
      />

      <SPVSetupModal
        isOpen={showSPVModal}
        onClose={() => setShowSPVModal(false)}
        onGenerate={handleGenerateSPV}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onContinue={handleContinueToToken}
      />

      <TokenSetupScreen
        isOpen={showTokenSetup}
        onClose={() => setShowTokenSetup(false)}
        onPublish={handlePublish}
        assetImage={assetImage}
        isMinting={isMinting}
        mintingProgress={mintingProgress}
      />
    </div>
  )
}

export default TokenizationHub
