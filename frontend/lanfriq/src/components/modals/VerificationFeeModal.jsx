import { X, CheckCircle } from 'lucide-react';

const VerificationFeeModal = ({ isOpen, onClose, onPayment }) => {
  if (!isOpen) return null;

  const feeItems = [
    { label: 'Document validation', amount: 0.1 },
    { label: 'Authenticity check', amount: 0.1 },
    { label: 'Legal verification', amount: 0.1 },
    { label: 'Address + map', amount: 0.1 },
    { label: 'Report generation', amount: 0.1 }
  ];

  const total = 0.5; // 0.5 CAMP verification fee

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

        <button className="verification-fee-modal__pay-btn" onClick={onPayment}>
          Pay & Continue
        </button>

        <button className="verification-fee-modal__browse-btn" onClick={onClose}>
          Browse Market
        </button>
      </div>
    </div>
  );
};

export default VerificationFeeModal;
