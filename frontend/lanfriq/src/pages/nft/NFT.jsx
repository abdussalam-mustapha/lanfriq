import { useState, useEffect } from 'react';
import { Loader } from 'lucide-react';
import { useCamp } from '../../context/CampContext';
import { useAccount, useWalletClient } from 'wagmi';
import { ethers, BrowserProvider } from 'ethers';
import { 
  getIPNFTTerms, 
  checkIPNFTAccess,
  buyIPNFTAccess,
  formatCampPrice,
  formatDuration,
  formatRoyalty
} from '../../utils/campUtils';
import { 
  getPropertyNFTContract,
  getMarketplaceContract,
  createListing 
} from '../../utils/contractUtils';
import NFTDetailsModal from '../../components/modals/NFTDetailsModal';
import CreateListingModal from '../../components/modals/CreateListingModal';
import nft1 from '../../assets/nft1.png';
import nft2 from '../../assets/nft2.png';
import nft3 from '../../assets/nft3.png';
import './NFT.css';

const NFT = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showListingModal, setShowListingModal] = useState(false);
  const [userNFTs, setUserNFTs] = useState([]);
  const [contractNFTs, setContractNFTs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBuying, setIsBuying] = useState(false);

  const { origin, isAuthenticated } = useCamp();
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  // Placeholder data - will be replaced with real IPNFT data
  const nftData = [
    {
      id: 1,
      name: 'Lanfriq-#1234',
      image: nft1,
      price: '0.0000123 ETH',
      chain: 'Camp Network',
      smartContract: '0x6bC9...fD8E',
      tokenId: 'LANF-NFT-1293',
      isIPNFT: false // Placeholder
    },
    {
      id: 2,
      name: 'Lanfriq-#1234',
      image: nft2,
      price: '0.0000123 ETH',
      chain: 'Camp Network',
      smartContract: '0x6bC9...fD8E',
      tokenId: 'LANF-NFT-1294',
      isIPNFT: false
    },
    {
      id: 3,
      name: 'Lanfriq-#1234',
      image: nft3,
      price: '0.0000123 ETH',
      chain: 'Camp Network',
      smartContract: '0x6bC9...fD8E',
      tokenId: 'LANF-NFT-1295',
      isIPNFT: false
    },
    {
      id: 4,
      name: 'Lanfriq-#1234',
      image: nft3,
      price: '0.0000123 ETH',
      chain: 'Camp Network',
      smartContract: '0x6bC9...fD8E',
      tokenId: 'LANF-NFT-1296',
      isIPNFT: false
    },
    {
      id: 5,
      name: 'Lanfriq-#1234',
      image: nft1,
      price: '0.0000123 ETH',
      chain: 'Camp Network',
      smartContract: '0x6bC9...fD8E',
      tokenId: 'LANF-NFT-1297',
      isIPNFT: false
    },
    {
      id: 6,
      name: 'Lanfriq-#1234',
      image: nft1,
      price: '0.0000123 ETH',
      chain: 'Camp Network',
      smartContract: '0x6bC9...fD8E',
      tokenId: 'LANF-NFT-1298',
      isIPNFT: false
    }
  ];

  // Fetch user's IPNFTs when authenticated
  useEffect(() => {
    if (isAuthenticated && origin && address) {
      fetchUserIPNFTs();
    }
    if (address && walletClient) {
      fetchContractNFTs();
    }
  }, [isAuthenticated, origin, address, walletClient]);

  const fetchContractNFTs = async () => {
    if (!walletClient || !address) return;

    try {
      const provider = new BrowserProvider(walletClient);
      const contract = getPropertyNFTContract(provider);

      // Note: PropertyNFT doesn't have enumerable extension
      // For now, we'll display a message to check specific token IDs
      // In production, you'd track token IDs via events or a subgraph
      
      // Placeholder: Try to fetch a few token IDs (1-10)
      const nfts = [];
      for (let tokenId = 1; tokenId <= 10; tokenId++) {
        try {
          const owner = await contract.ownerOf(tokenId);
          
          if (owner.toLowerCase() === address.toLowerCase()) {
            // User owns this token
            const property = await contract.getProperty(tokenId);
            const tokenURI = await contract.tokenURI(tokenId);

            nfts.push({
              id: `property-${tokenId}`,
              name: `Property #${tokenId}`,
              address: property.propertyAddress,
              image: nft1, // Default image
              price: ethers.formatEther(property.pricePerShare) + ' CAMP',
              valuation: ethers.formatEther(property.valuation) + ' CAMP',
              totalShares: property.totalShares.toString(),
              availableShares: property.availableShares.toString(),
              isVerified: property.isVerified,
              chain: 'Camp Network',
              smartContract: import.meta.env.VITE_PROPERTY_NFT_ADDRESS,
              tokenId: tokenId.toString(),
              isIPNFT: false,
              isPropertyNFT: true,
            });
          }
        } catch (error) {
          // Token doesn't exist or not owned by user
          continue;
        }
      }

      setContractNFTs(nfts);
      console.log('Found PropertyNFTs:', nfts.length);
    } catch (error) {
      console.error('Failed to fetch PropertyNFTs:', error);
    }
  };

  const fetchUserIPNFTs = async () => {
    if (!origin || !address) return;

    try {
      setIsLoading(true);
      
      // Get user's IPNFT balance
      const balance = await origin.balanceOf(address);
      console.log('User IPNFT balance:', balance);

      // Fetch details for each IPNFT owned by user
      const nfts = [];
      for (let i = 0; i < balance; i++) {
        try {
          // In production, you'd fetch token IDs owned by the user
          // For now, we'll just demonstrate the structure
          const tokenId = `${i + 1}`; // Placeholder token ID
          
          const terms = await getIPNFTTerms(origin, tokenId);
          const tokenURI = await origin.tokenURI(tokenId);
          
          nfts.push({
            id: tokenId,
            name: `Property IPNFT #${tokenId}`,
            tokenId: tokenId,
            price: formatCampPrice(terms.price),
            duration: formatDuration(terms.duration),
            royalty: formatRoyalty(terms.royaltyBps),
            chain: 'Camp Network',
            isIPNFT: true,
            terms: terms,
          });
        } catch (error) {
          console.error(`Failed to fetch IPNFT ${i}:`, error);
        }
      }

      setUserNFTs(nfts);
    } catch (error) {
      console.error('Failed to fetch user IPNFTs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuyAccess = async (nft) => {
    if (!isAuthenticated || !origin) {
      alert('Please connect your wallet to buy access');
      return;
    }

    if (!nft.isIPNFT) {
      alert('This is not an IPNFT');
      return;
    }

    try {
      setIsBuying(true);
      await buyIPNFTAccess(origin, nft.tokenId);
      alert(`Successfully purchased access to ${nft.name}!`);
      await fetchUserIPNFTs(); // Refresh the list
    } catch (error) {
      console.error('Failed to buy access:', error);
      alert(`Failed to buy access: ${error.message}`);
    } finally {
      setIsBuying(false);
    }
  };

  const handleNFTClick = async (nft) => {
    if (nft.isIPNFT && origin && address) {
      // Check if user has access
      const hasAccess = await checkIPNFTAccess(origin, nft.tokenId, address);
      setSelectedNFT({ ...nft, hasAccess });
    } else {
      setSelectedNFT(nft);
    }
    setShowModal(true);
  };

  const handleCreateListing = (nft) => {
    if (!nft.isPropertyNFT) {
      alert('Only PropertyNFTs can be listed on the marketplace');
      return;
    }
    setSelectedNFT(nft);
    setShowListingModal(true);
  };

  const handleSubmitListing = async (listingData) => {
    if (!walletClient) {
      alert('Please connect your wallet');
      return;
    }

    try {
      const provider = new BrowserProvider(walletClient);
      const signer = await provider.getSigner();

      const { listingId } = await createListing(signer, {
        propertyTokenId: listingData.propertyTokenId,
        pricePerShare: ethers.parseEther(listingData.pricePerShare),
        sharesAvailable: listingData.sharesAvailable,
        paymentToken: listingData.paymentToken,
      });

      alert(`Listing created successfully! Listing ID: ${listingId}`);
      await fetchContractNFTs(); // Refresh
    } catch (error) {
      throw error;
    }
  };

  // Combine all NFT sources
  const allNFTs = [...contractNFTs, ...userNFTs, ...nftData.slice(0, 3)]; // Show contract NFTs, IPNFTs, and 3 placeholders

  const filteredNFTs = allNFTs.filter(nft =>
    nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    nft.chain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getChainIcon = (chain) => {
    const chainColors = {
      'Ethereum': '#627EEA',
      'Polygon': '#8247E5',
      'Linea': '#61DFFF',
      'Camp Network': '#8cc043'
    };
    return chainColors[chain] || '#8cc043';
  };

  return (
    <div className="nft-page">
      <div className="nft-page__header">
        <div className="nft-page__title-section">
          <div className="nft-page__icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="4" width="7" height="7" stroke="currentColor" strokeWidth="2" />
              <rect x="13" y="4" width="7" height="7" stroke="currentColor" strokeWidth="2" />
              <rect x="4" y="13" width="7" height="7" stroke="currentColor" strokeWidth="2" />
              <rect x="13" y="13" width="7" height="7" stroke="currentColor" strokeWidth="2" />
            </svg>
          </div>
          <h1>Asset</h1>
        </div>
      </div>

      <div className="nft-page__hero">
        <div className="nft-page__hero-content">
          <div className="nft-page__hero-left">
            <h2>Discover opportunities<br />in the modern market.</h2>
            <p>Explore Lanfriq's marketplace of tokenized properties on Camp Network</p>
            <button className="nft-page__explore-btn">
              Explore market →
            </button>
          </div>
          <div className="nft-page__hero-right">
            <div className="nft-page__hero-pattern"></div>
          </div>
        </div>
      </div>

      {isLoading && (
        <div className="nft-page__loading">
          <Loader size={32} className="spinning" />
          <p>Loading your IPNFTs...</p>
        </div>
      )}

      {isAuthenticated && userNFTs.length > 0 && (
        <div className="nft-page__section">
          <h2 className="nft-page__section-title">Your Property IPNFTs</h2>
          <p className="nft-page__section-subtitle">
            Manage your tokenized property assets on Camp Network
          </p>
        </div>
      )}

      <div className="nft-page__grid">
        {filteredNFTs.map((nft) => (
          <div
            key={nft.id}
            className={`nft-card ${nft.isIPNFT ? 'nft-card--ipnft' : ''}`}
            onClick={() => handleNFTClick(nft)}
          >
            <div className="nft-card__image">
              <img src={nft.image} alt={nft.name} />
              {nft.isIPNFT && (
                <div className="nft-card__badge">
                  <span>IPNFT</span>
                </div>
              )}
              {nft.isPropertyNFT && (
                <div className="nft-card__badge property">
                  <span>Property NFT</span>
                </div>
              )}
            </div>
            <div className="nft-card__content">
              <h3>{nft.name}</h3>
              <p className="nft-card__price">{nft.price}</p>
              <div className="nft-card__chain" style={{ color: getChainIcon(nft.chain) }}>
                <div 
                  className="nft-card__chain-dot" 
                  style={{ backgroundColor: getChainIcon(nft.chain) }}
                />
                {nft.chain}
              </div>
              {nft.isIPNFT && nft.royalty && (
                <div className="nft-card__royalty">
                  Royalty: {nft.royalty}
                </div>
              )}
              {nft.isPropertyNFT && (
                <div className="nft-card__actions">
                  <button 
                    className="list-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCreateListing(nft);
                    }}
                  >
                    List for Sale
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {!isLoading && filteredNFTs.length === 0 && (
        <div className="nft-page__empty">
          <p>No NFTs found{searchQuery && ' matching your search'}</p>
          {!isAuthenticated && (
            <p className="nft-page__empty-hint">
              Connect your wallet to view your property IPNFTs
            </p>
          )}
        </div>
      )}

      <NFTDetailsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        nft={selectedNFT}
        onBuyAccess={handleBuyAccess}
        isBuying={isBuying}
      />

      {showListingModal && selectedNFT && (
        <CreateListingModal
          nft={selectedNFT}
          onClose={() => {
            setShowListingModal(false);
            setSelectedNFT(null);
          }}
          onSubmit={handleSubmitListing}
        />
      )}
    </div>
  );
};

export default NFT;
