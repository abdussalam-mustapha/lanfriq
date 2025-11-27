import { X } from 'lucide-react';
import './NFTDetailsModal.css';

const NFTDetailsModal = ({ isOpen, onClose, nft }) => {
  if (!isOpen || !nft) return null;

  return (
    <div className="nft-modal__backdrop" onClick={onClose}>
      <div className="nft-modal" onClick={(e) => e.stopPropagation()}>
        <button className="nft-modal__close" onClick={onClose}>
          <X size={24} />
        </button>

        <h2 className="nft-modal__title">NFT details</h2>

        <div className="nft-modal__image">
          <img src={nft.image} alt={nft.name} />
        </div>

        <div className="nft-modal__details">
          <div className="nft-modal__row">
            <span className="nft-modal__label">Name:</span>
            <span className="nft-modal__value">{nft.name}</span>
          </div>

          <div className="nft-modal__row">
            <span className="nft-modal__label">Chain:</span>
            <div className="nft-modal__chain">
              <div 
                className="nft-modal__chain-icon"
                style={{ 
                  backgroundColor: nft.chain === 'Ethereum' ? '#627EEA' : 
                                   nft.chain === 'Polygon' ? '#8247E5' : '#61DFFF'
                }}
              />
              <span className="nft-modal__value">{nft.chain}</span>
            </div>
          </div>

          <div className="nft-modal__row">
            <span className="nft-modal__label">Price:</span>
            <span className="nft-modal__value">{nft.price}</span>
          </div>

          <div className="nft-modal__row">
            <span className="nft-modal__label">Smart Contract:</span>
            <span className="nft-modal__value">{nft.smartContract}</span>
          </div>

          <div className="nft-modal__row">
            <span className="nft-modal__label">Token ID:</span>
            <span className="nft-modal__value">{nft.tokenId}</span>
          </div>
        </div>

        <button className="nft-modal__opensea-btn">
          View on OpenSea
        </button>

        <div className="nft-modal__footer">
          Powered by <span>Lanfriq</span>
        </div>
      </div>
    </div>
  );
};

export default NFTDetailsModal;
