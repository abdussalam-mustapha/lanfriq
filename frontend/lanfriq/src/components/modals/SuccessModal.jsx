import { CheckCircle } from 'lucide-react';

const SuccessModal = ({ isOpen, onContinue }) => {
  if (!isOpen) return null;

  return (
    <div className="modal__backdrop" onClick={onContinue}>
      <div className="verification-fee-modal" onClick={(e) => e.stopPropagation()}>
        <div className="verification-fee-modal__check">
          <CheckCircle size={64} strokeWidth={2} />
        </div>

        <h2>Successful</h2>
        <p>SPV Successfully Created. Your SPV is now active and ready for token configuration.</p>

        <button className="verification-fee-modal__pay-btn" onClick={onContinue}>
          Continue to Token Setup
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
