import { useState } from 'react';
import { X, Download, Eye, Layers } from 'lucide-react';

const SPVSetupModal = ({ isOpen, onClose, onGenerate }) => {
  const [acceptedTerms, setAcceptedTerms] = useState({
    term1: false,
    term2: false
  });

  if (!isOpen) return null;

  const handleGenerateSPV = () => {
    if (acceptedTerms.term1 && acceptedTerms.term2) {
      onGenerate();
    }
  };

  const canGenerate = acceptedTerms.term1 && acceptedTerms.term2;

  return (
    <div className="modal__backdrop" onClick={onClose}>
      <div className="modal__container" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>SPV Setup</h2>
          <button className="modal__close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal__body">
          <div className="modal__left">
            <Layers size={48} className="modal__icon" />
            <h3>What is an SPV?</h3>
            <p>
              A Special Purpose Vehicle (SPV) is a legal entity created specifically to hold and manage your tokenized property. 
              It provides:
            </p>
            <ul style={{ marginTop: '1rem', paddingLeft: '1.25rem' }}>
              <li>Legal separation between property and personal assets</li>
              <li>Limited liability protection for investors</li>
              <li>Transparent governance structure</li>
              <li>Compliance with regulatory requirements</li>
            </ul>
          </div>

          <div className="modal__right">
            <div className="spv-setup__section">
              <h4>SPV Overview</h4>
              <div className="spv-setup__row">
                <span>Name</span>
                <strong>Lanfriq SPV - Property #0003</strong>
              </div>
              <div className="spv-setup__row">
                <span>Type</span>
                <strong>LLC</strong>
              </div>
              <div className="spv-setup__row">
                <span>Jurisdiction</span>
                <strong>Nigeria</strong>
              </div>
              <div className="spv-setup__row">
                <span>Status</span>
                <span className="spv-setup__status">Pending</span>
              </div>
              <div className="spv-setup__row">
                <span>Wallet</span>
                <strong>0xA2FA3B9O...972D</strong>
              </div>
            </div>

            <div className="spv-setup__section">
              <h4>Legal Documents</h4>
              <div className="spv-setup__doc">
                <span>Incorporation Summary</span>
                <div className="spv-setup__actions">
                  <button className="spv-setup__view">
                    <Eye size={16} />
                    View
                  </button>
                  <button className="spv-setup__download">
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
              <div className="spv-setup__doc">
                <span>Operating Agreement</span>
                <div className="spv-setup__actions">
                  <button className="spv-setup__view">
                    <Eye size={16} />
                    View
                  </button>
                  <button className="spv-setup__download">
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
              <div className="spv-setup__doc">
                <span>Share Token Issuance Draft</span>
                <div className="spv-setup__actions">
                  <button className="spv-setup__view">
                    <Eye size={16} />
                    View
                  </button>
                  <button className="spv-setup__download">
                    <Download size={16} />
                    Download
                  </button>
                </div>
              </div>
            </div>

            <div className="spv-setup__section">
              <h4>Creation Terms</h4>
              <label className="spv-setup__checkbox">
                <input
                  type="checkbox"
                  checked={acceptedTerms.term1}
                  onChange={(e) => setAcceptedTerms(prev => ({ ...prev, term1: e.target.checked }))}
                />
                <span>
                  I understand that the SPV will be the legal owner of the tokenized property and 
                  will operate according to the terms outlined in the operating agreement.
                </span>
              </label>
              <label className="spv-setup__checkbox">
                <input
                  type="checkbox"
                  checked={acceptedTerms.term2}
                  onChange={(e) => setAcceptedTerms(prev => ({ ...prev, term2: e.target.checked }))}
                />
                <span>
                  I agree to comply with all regulatory requirements and maintain proper governance 
                  of the SPV throughout the property's tokenized lifecycle.
                </span>
              </label>
            </div>

            <button
              className="modal__btn modal__btn--primary"
              onClick={handleGenerateSPV}
              disabled={!canGenerate}
              style={{ width: '100%', marginTop: '1.5rem', opacity: canGenerate ? 1 : 0.5 }}
            >
              Generate SPV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SPVSetupModal;
