import React, { useState } from 'react';
import { X } from 'lucide-react';
import './SellModal.css';

const SellModal = ({ asset, onClose }) => {
  const [sellType, setSellType] = useState('market'); // 'market' or 'limit'
  const [amount, setAmount] = useState('');
  const [limitPrice, setLimitPrice] = useState('');

  if (!asset) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const sellData = {
      assetId: asset.id,
      sellType,
      amount: parseFloat(amount),
      ...(sellType === 'limit' && { limitPrice: parseFloat(limitPrice) })
    };

    console.log('Sell Order:', sellData);
    // TODO: Implement actual sell logic
    
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="sell-modal-backdrop" onClick={handleBackdropClick}>
      <div className="sell-modal">
        <div className="sell-modal__header">
          <h2 className="sell-modal__title">Sell {asset.collection}</h2>
          <button className="sell-modal__close" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="sell-modal__asset-info">
          <div className="sell-modal__asset-image">
            <div className="sell-modal__image-placeholder">🏢</div>
          </div>
          <div className="sell-modal__asset-details">
            <div className="sell-modal__asset-name">{asset.collection}</div>
            <div className="sell-modal__asset-token">Token #{asset.tokenNo}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Sell Type Toggle */}
          <div className="sell-modal__toggle-group">
            <button
              type="button"
              className={`sell-modal__toggle-btn ${sellType === 'market' ? 'active' : ''}`}
              onClick={() => setSellType('market')}
            >
              Market
            </button>
            <button
              type="button"
              className={`sell-modal__toggle-btn ${sellType === 'limit' ? 'active' : ''}`}
              onClick={() => setSellType('limit')}
            >
              Limit
            </button>
          </div>

          {/* Current Price (for Market orders) */}
          {sellType === 'market' && (
            <div className="sell-modal__price-info">
              <div className="sell-modal__price-label">Current Price</div>
              <div className="sell-modal__price-value">
                {asset.currentPrice} SOL
              </div>
            </div>
          )}

          {/* Limit Price Input (for Limit orders) */}
          {sellType === 'limit' && (
            <div className="sell-modal__form-group">
              <label className="sell-modal__label">
                Limit Price
                <span className="sell-modal__label-note">
                  Current: {asset.currentPrice} SOL
                </span>
              </label>
              <div className="sell-modal__input-wrapper">
                <input
                  type="number"
                  className="sell-modal__input"
                  placeholder="0.00"
                  value={limitPrice}
                  onChange={(e) => setLimitPrice(e.target.value)}
                  step="0.01"
                  min="0"
                  required={sellType === 'limit'}
                />
                <span className="sell-modal__input-suffix">SOL</span>
              </div>
            </div>
          )}

          {/* Amount to Sell */}
          <div className="sell-modal__form-group">
            <label className="sell-modal__label">Amount to Sell</label>
            <div className="sell-modal__input-wrapper">
              <input
                type="number"
                className="sell-modal__input"
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                step="1"
                min="1"
                max={asset.tokenNo}
                required
              />
              <span className="sell-modal__input-suffix">Tokens</span>
            </div>
            <div className="sell-modal__input-help">
              Available: {asset.tokenNo} tokens
            </div>
          </div>

          {/* Total Value */}
          {amount && (
            <div className="sell-modal__total">
              <div className="sell-modal__total-label">Total Value</div>
              <div className="sell-modal__total-value">
                {sellType === 'market'
                  ? (parseFloat(amount) * parseFloat(asset.currentPrice)).toFixed(2)
                  : limitPrice
                  ? (parseFloat(amount) * parseFloat(limitPrice)).toFixed(2)
                  : '0.00'} SOL
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="sell-modal__actions">
            <button type="button" className="sell-modal__btn sell-modal__btn--cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="sell-modal__btn sell-modal__btn--sell">
              {sellType === 'market' ? 'Sell Now' : 'Place Limit Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SellModal;
