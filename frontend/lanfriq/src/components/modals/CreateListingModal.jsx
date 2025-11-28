import { useState } from 'react';
import { X, Tag, Coins, TrendingUp } from 'lucide-react';
import './CreateListingModal.css';

const CreateListingModal = ({ nft, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    pricePerShare: '',
    sharesAvailable: '',
    paymentToken: '0x0000000000000000000000000000000000000000', // Native CAMP
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.pricePerShare || !formData.sharesAvailable) {
      alert('Please fill in all fields');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        propertyTokenId: nft.tokenId,
        pricePerShare: formData.pricePerShare,
        sharesAvailable: parseInt(formData.sharesAvailable),
        paymentToken: formData.paymentToken,
      });
      onClose();
    } catch (error) {
      console.error('Failed to create listing:', error);
      alert(`Failed to create listing: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="create-listing-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-header">
          <div className="modal-icon">
            <Tag size={24} />
          </div>
          <h2>Create Marketplace Listing</h2>
          <p>List your property shares for sale</p>
        </div>

        <div className="nft-preview">
          <img src={nft.image} alt={nft.name} />
          <div>
            <h3>{nft.name}</h3>
            <p>Token ID: {nft.tokenId}</p>
            <p>Available Shares: {nft.availableShares || 'N/A'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>
              <Coins size={18} />
              Price Per Share (CAMP)
            </label>
            <input
              type="number"
              step="0.001"
              name="pricePerShare"
              value={formData.pricePerShare}
              onChange={handleChange}
              placeholder="0.001"
              required
            />
          </div>

          <div className="form-group">
            <label>
              <TrendingUp size={18} />
              Shares to List
            </label>
            <input
              type="number"
              name="sharesAvailable"
              value={formData.sharesAvailable}
              onChange={handleChange}
              placeholder="100"
              max={nft.availableShares}
              required
            />
          </div>

          <div className="form-group">
            <label>Payment Token</label>
            <select
              name="paymentToken"
              value={formData.paymentToken}
              onChange={handleChange}
            >
              <option value="0x0000000000000000000000000000000000000000">
                Native CAMP
              </option>
            </select>
          </div>

          <div className="listing-summary">
            <h3>Listing Summary</h3>
            <div className="summary-row">
              <span>Price per share:</span>
              <strong>{formData.pricePerShare || '0'} CAMP</strong>
            </div>
            <div className="summary-row">
              <span>Total shares:</span>
              <strong>{formData.sharesAvailable || '0'}</strong>
            </div>
            <div className="summary-row total">
              <span>Total value:</span>
              <strong>
                {(parseFloat(formData.pricePerShare || 0) * parseInt(formData.sharesAvailable || 0)).toFixed(3)} CAMP
              </strong>
            </div>
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Listing...' : 'Create Listing'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateListingModal;
