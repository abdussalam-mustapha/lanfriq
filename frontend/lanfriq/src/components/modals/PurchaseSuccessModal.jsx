import { useState } from 'react'
import { X, Check, Loader2, ExternalLink } from 'lucide-react'
import { useAccount, useWalletClient } from 'wagmi'
import { ethers, BrowserProvider } from 'ethers'
import { useCamp } from '../../context/CampContext'
import { mintPropertyIPNFT, DEFAULT_LICENSE_TERMS } from '../../utils/campUtils'
import { mintPropertyNFT } from '../../utils/contractUtils'
import logo from '../../assets/logo.png'
import './PurchaseSuccessModal.css'

const PurchaseSuccessModal = ({ isOpen, onClose, txHash }) => {
  const [isMinting, setIsMinting] = useState(false)
  const [mintError, setMintError] = useState(null)
  const [ipnftTokenId, setIpnftTokenId] = useState(null)
  const [propertyNFTId, setPropertyNFTId] = useState(null)
  
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  const { origin } = useCamp()

  const handleMintNFT = async () => {
    if (!isConnected) {
      setMintError('Please connect your wallet')
      return
    }

    if (!origin) {
      setMintError('Camp Network not initialized')
      return
    }

    try {
      setIsMinting(true)
      setMintError(null)

      // Step 1: Mint IPNFT (Camp Network)
      const metadata = {
        name: 'Property Share Certificate',
        description: 'Fractional ownership certificate for tokenized property',
        attributes: [
          { trait_type: 'Purchase Transaction', value: txHash || 'N/A' },
          { trait_type: 'Purchase Date', value: new Date().toISOString() }
        ]
      }

      // Create a dummy file for IPNFT (in production, use actual property documents)
      const blob = new Blob([JSON.stringify(metadata)], { type: 'application/json' })
      const file = new File([blob], 'property-certificate.json', { type: 'application/json' })

      const ipTokenId = await mintPropertyIPNFT(
        origin,
        file,
        metadata,
        DEFAULT_LICENSE_TERMS
      )

      setIpnftTokenId(ipTokenId)

      // Step 2: Mint PropertyNFT (Custom Contract)
      const provider = new BrowserProvider(walletClient)
      const signer = await provider.getSigner()

      const propertyData = {
        to: address,
        address: 'Property Address',
        valuation: ethers.parseEther('500000'),
        totalShares: 1000,
        pricePerShare: ethers.parseEther('500'),
        uri: `ipfs://ipnft/${ipTokenId}`
      }

      const receipt = await mintPropertyNFT(signer, propertyData)
      setPropertyNFTId(receipt.tokenId || 'Minted')

      alert('NFT minted successfully!')
    } catch (error) {
      console.error('Minting failed:', error)
      setMintError(error.message || 'Failed to mint NFT')
    } finally {
      setIsMinting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="purchase-success-overlay" onClick={onClose}>
      <div className="purchase-success-modal" onClick={(e) => e.stopPropagation()}>
        <div className="purchase-success__header">
          <img src={logo} alt="Lanfriq" className="purchase-success__logo" />
          <button className="purchase-success__close" onClick={onClose}>
            <X size={20} />
            Close this tab
          </button>
        </div>

        <div className="purchase-success__content">
          <div className="purchase-success__icon-wrapper">
            <div className="purchase-success__icon-bg"></div>
            <Check size={64} className="purchase-success__icon" />
          </div>

          <h2 className="purchase-success__title">Success</h2>
          <p className="purchase-success__message">
            Asset has been successfully purchased
          </p>

          {txHash && (
            <div className="purchase-success__tx-info">
              <span>Transaction Hash:</span>
              <a 
                href={`https://explorer.basecamp.t.raas.gelato.cloud/tx/${txHash}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="purchase-success__tx-link"
              >
                {txHash.substring(0, 10)}...{txHash.substring(txHash.length - 8)}
                <ExternalLink size={14} />
              </a>
            </div>
          )}

          {mintError && (
            <div className="purchase-success__error">
              {mintError}
            </div>
          )}

          {ipnftTokenId && (
            <div className="purchase-success__nft-info">
              <p>IPNFT Token ID: {ipnftTokenId.toString()}</p>
              {propertyNFTId && <p>Property NFT ID: {propertyNFTId.toString()}</p>}
            </div>
          )}

          <button 
            className="purchase-success__mint-btn" 
            onClick={handleMintNFT}
            disabled={isMinting || !!ipnftTokenId}
          >
            {isMinting ? (
              <>
                <Loader2 size={18} className="purchase-success__spinner" />
                Minting...
              </>
            ) : ipnftTokenId ? (
              'NFT Minted'
            ) : (
              'Mint NFT'
            )}
          </button>
          <button className="purchase-success__view-btn" onClick={onClose}>
            View asset
          </button>
        </div>
      </div>
    </div>
  )
}

export default PurchaseSuccessModal
