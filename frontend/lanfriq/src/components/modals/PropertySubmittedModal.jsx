import { CheckCircle } from 'lucide-react';

const PropertySubmittedModal = ({ isOpen, onViewStatus, onBrowseMarket }) => {
  if (!isOpen) return null;

  return (
    <div className="modal__backdrop" onClick={onBrowseMarket}>
      <div className="verification-fee-modal" onClick={(e) => e.stopPropagation()}>
        <div className="verification-fee-modal__check">
          <CheckCircle size={64} strokeWidth={2} />
        </div>

        <h2>Property Submitted</h2>
        <p>Your property has been successfully sent for validation. You'll receive a notification once verified.</p>

        <button className="verification-fee-modal__pay-btn" onClick={onViewStatus}>
          View Status
        </button>

        <button className="verification-fee-modal__browse-btn" onClick={onBrowseMarket}>
          Browse Market
        </button>
      </div>
    </div>
  );
};

export default PropertySubmittedModal;
