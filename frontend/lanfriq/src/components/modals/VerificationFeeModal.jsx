import { useState, useEffect } from 'react';
import { X, CheckCircle, Loader2 } from 'lucide-react';
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

/**
 * VerificationFeeModal - Handles payment of 0.5 CAMP verification fee
 * 
 * Payment Flow:
 * 1. User clicks "Pay & Continue" button
 * 2. sendTransaction sends 0.5 CAMP to platform wallet
 * 3. useWaitForTransactionReceipt monitors transaction confirmation
 * 4. On success, calls onPayment with transaction hash
 * 5. Parent component can store txHash for verification tracking
 * 
 * @param {boolean} isOpen - Modal visibility state
 * @param {function} onClose - Close modal callback
 * @param {function} onPayment - Called with txHash when payment succeeds
 * @param {string} recipientAddress - Platform wallet address (from .env)
 */
const VerificationFeeModal = ({ isOpen, onClose, onPayment, recipientAddress }) => {
  const [error, setError] = useState(null);

  const { sendTransaction, data: hash, isPending: isSending } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash: hash,
  });

  // Call onPayment when transaction is confirmed
  useEffect(() => {
    if (isSuccess && hash && onPayment) {
      console.log('Payment confirmed! Hash:', hash);
      onPayment(hash);
    }
  }, [isSuccess, hash, onPayment]);

  if (!isOpen) return null;

  const feeItems = [
    { label: 'Document validation', amount: 0.1 },
    { label: 'Authenticity check', amount: 0.1 },
    { label: 'Legal verification', amount: 0.1 },
    { label: 'Address + map', amount: 0.1 },
    { label: 'Report generation', amount: 0.1 }
  ];

  const total = 0.5; // 0.5 CAMP verification fee

  const handlePayment = async () => {
    try {
      setError(null);
      
      // Use recipient address or fallback to a valid address
      // Note: In production, this should be the platform's treasury wallet
      const recipient = recipientAddress && recipientAddress !== '0x0000000000000000000000000000000000000000' 
        ? recipientAddress 
        : null;
      
      if (!recipient) {
        setError('Platform wallet address not configured. Please contact support.');
        return;
      }
      
      console.log('Sending payment to:', recipient);
      
      // sendTransaction in wagmi v2 - it will prompt the wallet
      sendTransaction({
        to: recipient,
        value: parseEther('0.5'),
      });
      
    } catch (err) {
      console.error('Payment failed:', err);
      setError(err.message || 'Payment failed. Please try again.');
    }
  };

  const isProcessing = isSending || isConfirming;

  return (
    <div className="modal__backdrop" onClick={onClose}>
      <div className="verification-fee-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="verification-fee-modal__icon">
          <CheckCircle size={64} />
        </div>

        <h2>Verification Fee</h2>
        <p>Complete payment to begin property verification process</p>

        <div className="verification-fee-modal__items">
          {feeItems.map((item, index) => (
            <div key={index} className="verification-fee-modal__item">
              <span>{item.label}</span>
              <strong>{item.amount.toFixed(1)} CAMP</strong>
            </div>
          ))}
        </div>

        <div className="verification-fee-modal__total">
          <span>Total Amount</span>
          <strong>{total.toFixed(1)} CAMP</strong>
        </div>

        {error && (
          <div className="verification-fee-modal__error">
            {error}
          </div>
        )}

        {hash && isConfirming && (
          <div className="verification-fee-modal__status">
            <Loader2 size={20} className="verification-fee-modal__spinner" />
            Confirming transaction...
          </div>
        )}

        <button 
          className="verification-fee-modal__pay-btn" 
          onClick={handlePayment}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 size={18} className="verification-fee-modal__spinner" />
              {isSending ? 'Sending...' : 'Confirming...'}
            </>
          ) : (
            'Pay & Continue'
          )}
        </button>

        <button 
          className="verification-fee-modal__browse-btn" 
          onClick={onClose}
          disabled={isProcessing}
        >
          Browse Market
        </button>
      </div>
    </div>
  );
};

export default VerificationFeeModal;
