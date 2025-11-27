import { ArrowRight } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import Section from '../ui/Section'
import ctaImage from '../../assets/startYourRealEstateTokenizationSideImage.png'
import heroBgLight from '../../assets/heroBgLight.png'
import heroBgDark from '../../assets/heroBgDark.png'
import './CTA.css'

const CTA = () => {
  const { theme } = useTheme()
  const heroBg = theme === 'light' ? heroBgLight : heroBgDark
  
  return (
    <Section variant="default" className="cta-section">
      <div className="container" style={{ backgroundImage: `url(${heroBg})` }}>
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
      </div>
    </Section>
  )
}

export default CTA
