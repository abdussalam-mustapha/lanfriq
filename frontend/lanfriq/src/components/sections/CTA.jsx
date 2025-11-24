import { ArrowRight } from 'lucide-react'
import Section from '../ui/Section'
import ctaImage from '../../assets/startYourRealEstateTokenizationSideImage.png'
import './CTA.css'

const CTA = () => {
  return (
    <Section variant="default" className="cta-section">
      <div className="cta__content">
        <h2 className="cta__title">
          Start Your Real Estate<br />
          Tokenization Journey
        </h2>
        <div className="cta__actions">
          <button className="btn btn--primary btn--large">
            <span>Start Tokenization</span>
            <ArrowRight size={16} strokeWidth={1.4375} color="#ffffff" />
          </button>
          <button className="btn btn--cta-secondary">Explore Market</button>
        </div>
      </div>
      <div className="cta__image">
        <img src={ctaImage} alt="Start Your Journey" />
      </div>
    </Section>
  )
}

export default CTA
