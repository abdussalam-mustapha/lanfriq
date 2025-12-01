import { useState } from 'react';
import { X, Tag, Coins, TrendingUp } from 'lucide-react';
import './CreateListingModal.css';

const CreateListingModal = ({ nft, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    pricePerShare: '',
    sharesAvailable: '',
    paymentToken: 'CUSTOM', // Default to custom so user enters CAMP token address
    customTokenAddress: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.pricePerShare || !formData.sharesAvailable) {
      alert('Please fill in all fields');
      return;
    }
    
    // Determine the actual payment token address
    let paymentTokenAddress;
    if (formData.paymentToken === 'NATIVE') {
      paymentTokenAddress = '0x0000000000000000000000000000000000000000';
    } else if (formData.paymentToken === 'CUSTOM') {
      if (!formData.customTokenAddress) {
        alert('Please enter the CAMP token contract address');
        return;
      }
      paymentTokenAddress = formData.customTokenAddress;
    }

    try {
      setIsSubmitting(true);
      await onSubmit({
        propertyTokenId: nft.tokenId,
        pricePerShare: formData.pricePerShare,
        sharesAvailable: parseInt(formData.sharesAvailable),
        paymentToken: paymentTokenAddress,
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
              Shares Available
            </label>
            <input
              type="number"
              name="sharesAvailable"
              value={formData.sharesAvailable}
              onChange={handleChange}
              placeholder="Enter number of shares"
              max={nft.availableShares}
              required
            />
            <small>Max available: {nft.availableShares || 'N/A'}</small>
          </div>

          <div className="form-group">
            <label>Payment Token</label>
            <select
              name="paymentToken"
              value={formData.paymentToken}
              onChange={handleChange}
            >
              <option value="CUSTOM">
                CAMP ERC20 Token (Enter address below)
              </option>
              <option value="NATIVE">
                Native Token (Not recommended - requires native balance)
              </option>
            </select>
            {formData.paymentToken === 'CUSTOM' && (
              <div style={{ marginTop: '0.5rem' }}>
                <input
                  type="text"
                  name="customTokenAddress"
                  value={formData.customTokenAddress}
                  onChange={handleChange}
                  placeholder="Enter CAMP token contract address (0x...)"
                  required
                />
                <small style={{ display: 'block', marginTop: '0.25rem', color: 'var(--text-secondary)' }}>
                  You can find the CAMP token address on Camp Network block explorer
                </small>
              </div>
            )}
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
