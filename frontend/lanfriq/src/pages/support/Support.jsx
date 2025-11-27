import { HelpCircle } from 'lucide-react';
import './Support.css';

const Support = () => {
  return (
    <div className="support-page">
      <div className="support-page__header">
        <div className="support-page__title-section">
          <div className="support-page__icon">
            <HelpCircle size={24} />
          </div>
          <h1>Support / Help</h1>
        </div>
      </div>

      <div className="support-page__empty">
        <div className="support-page__empty-icon">
          <HelpCircle size={64} strokeWidth={1.5} />
        </div>
        <h2>Help & Support Coming Soon</h2>
        <p>
          We're working on building comprehensive support resources for you. 
          In the meantime, please reach out to us at{' '}
          <a href="mailto:support@lanfriq.com">support@lanfriq.com</a>
        </p>
      </div>
    </div>
  );
};

export default Support;
