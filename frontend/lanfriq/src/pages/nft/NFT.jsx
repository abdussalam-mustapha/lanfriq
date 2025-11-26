import { useState } from 'react';
import { Search, Eye } from 'lucide-react';
import NFTDetailsModal from '../../components/modals/NFTDetailsModal';
import './NFT.css';

const NFT = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const nftData = [
    {
      id: 1,
      name: 'Lanfriq-#1234',
      image: '/nft-1.jpg',
      price: '0.0000123 ETH',
      chain: 'Ethereum',
      smartContract: '0x6bC9...fD8E',
      tokenId: 'LANF-NFT-1293'
    },
    {
      id: 2,
      name: 'Lanfriq-#1234',
      image: '/nft-2.jpg',
      price: '0.0000123 ETH',
      chain: 'Polygon',
      smartContract: '0x6bC9...fD8E',
      tokenId: 'LANF-NFT-1294'
    },
    {
      id: 3,
      name: 'Lanfriq-#1234',
      image: '/nft-3.jpg',
      price: '0.0000123 ETH',
      chain: 'Linea',
      smartContract: '0x6bC9...fD8E',
      tokenId: 'LANF-NFT-1295'
    },
    {
      id: 4,
      name: 'Lanfriq-#1234',
      image: '/nft-4.jpg',
      price: '0.0000123 ETH',
      chain: 'Linea',
      smartContract: '0x6bC9...fD8E',
      tokenId: 'LANF-NFT-1296'
    },
    {
      id: 5,
      name: 'Lanfriq-#1234',
      image: '/nft-5.jpg',
      price: '0.0000123 ETH',
      chain: 'Ethereum',
      smartContract: '0x6bC9...fD8E',
      tokenId: 'LANF-NFT-1297'
    },
    {
      id: 6,
      name: 'Lanfriq-#1234',
      image: '/nft-6.jpg',
      price: '0.0000123 ETH',
      chain: 'Ethereum',
      smartContract: '0x6bC9...fD8E',
      tokenId: 'LANF-NFT-1298'
    }
  ];

  const handleNFTClick = (nft) => {
    setSelectedNFT(nft);
    setShowModal(true);
  };

  const filteredNFTs = nftData.filter(nft =>
    nft.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    nft.chain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getChainIcon = (chain) => {
    const chainColors = {
      'Ethereum': '#627EEA',
      'Polygon': '#8247E5',
      'Linea': '#61DFFF'
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
        <h2>Discover verified real estate opportunities across Africa with blockchain-backed trust.</h2>
        <button className="nft-page__explore-btn">
          Explore market →
        </button>
      </div>

      <div className="nft-page__search">
        <div className="nft-page__search-input">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search NFTs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="nft-page__grid">
        {filteredNFTs.map((nft) => (
          <div
            key={nft.id}
            className="nft-card"
            onClick={() => handleNFTClick(nft)}
          >
            <div className="nft-card__image">
              <img src={nft.image} alt={nft.name} />
              <button className="nft-card__view-btn">
                <Eye size={18} />
              </button>
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
            </div>
          </div>
        ))}
      </div>

      <NFTDetailsModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        nft={selectedNFT}
      />
    </div>
  );
};

export default NFT;
