import { useTheme } from '../../context/ThemeContext'
import { CheckCheck } from 'lucide-react'
import Section from '../ui/Section'
import investorImg from '../../assets/WhoIsItForInvestor.png'
import propertyOwnerImg from '../../assets/whoIsItForPropertyOwner.png'
import businessImg from '../../assets/WhoIsItForBusinessAndFirms.png'
import './TargetAudience.css'

const TargetAudience = () => {
  return (
    <>
      {/* Section Header */}
      <Section variant="default" className="audience-intro">
        <div className="audience-intro__header">
          <div className="audience-intro__label">
            <span className="audience-intro__label-line"></span>
            <span className="audience-intro__label-text">Who Is It for?</span>
            <span className="audience-intro__label-line"></span>
          </div>
          <h2 className="audience-intro__title">Built for Every Real Estate Stakeholder</h2>
        </div>
      </Section>

      {/* Investors Section */}
      <Section id="investors" variant="default" className="audience-section">
        <div className="audience-section__content audience-section__content--reverse">
          <div className="audience-section__image">
            <img src={investorImg} alt="Investors" />
          </div>
          <div className="audience-section__text">
            <h2 className="audience-section__title">Investors</h2>
            <p className="audience-section__description">
              Build wealth with fractional real estate. Break down the barriers to property ownership. Start investing in high-value real estate with any budget and earn passive income from property appreciation and rental yields.
            </p>
            <ul className="audience-section__features">
              <li><CheckCheck size={16} strokeWidth={2} color="var(--color-primary)" /><span>Start investing with as little as $10.</span></li>
              <li><CheckCheck size={16} strokeWidth={2} color="var(--color-primary)" /><span>Dividends paid directly to your wallet.</span></li>
              <li><CheckCheck size={16} strokeWidth={2} color="var(--color-primary)" /><span>Own fractions of properties worldwide.</span></li>
              <li><CheckCheck size={16} strokeWidth={2} color="var(--color-primary)" /><span>Trade your property tokens anytime, 24/7.</span></li>
            </ul>
            <button className="btn btn--cta">Start Investing</button>
          </div>
        </div>
      </Section>

      {/* Property Owners Section */}
      <Section id="property-owners" variant="alt" className="audience-section">
        <div className="audience-section__content">
          <div className="audience-section__text">
            <h2 className="audience-section__title">Property Owners</h2>
            <p className="audience-section__description">
              Unlock the liquid value of your home. Transform your illiquid real estate into tradeable digital assets. Tokenize your property to raise capital instantly, share ownership, or sell your asset faster than traditional markets allow.
            </p>
            <ul className="audience-section__features">
              <li><CheckCheck size={16} strokeWidth={2} color="var(--color-primary)" /><span>Raise funds without selling the entire property.</span></li>
              <li><CheckCheck size={16} strokeWidth={2} color="var(--color-primary)" /><span>Connect with investors from around the world.</span></li>
              <li><CheckCheck size={16} strokeWidth={2} color="var(--color-primary)" /><span>Skip the long wait times of traditional listing.</span></li>
              <li><CheckCheck size={16} strokeWidth={2} color="var(--color-primary)" /><span>Sell 1% or 100% of your asset—you decide.</span></li>
            </ul>
            <button className="btn btn--cta">Tokenize Your Home</button>
          </div>
          <div className="audience-section__image">
            <img src={propertyOwnerImg} alt="Property Owners" />
          </div>
        </div>
      </Section>

      {/* Businesses & Firms Section */}
      <Section id="businesses" variant="default" className="audience-section">
        <div className="audience-section__content audience-section__content--reverse">
          <div className="audience-section__image">
            <img src={businessImg} alt="Businesses and Firms" />
          </div>
          <div className="audience-section__text">
            <h2 className="audience-section__title">Businesses & Firms</h2>
            <p className="audience-section__description">
              Digitize commercial assets for global scale. Bring your commercial portfolio on-chain. Attract a diverse network of global retail and institutional investors to fund developments or liquidate commercial holdings efficiently.
            </p>
            <ul className="audience-section__features">
              <li><CheckCheck size={16} strokeWidth={2} color="var(--color-primary)" /><span>Tap into international capital markets.</span></li>
              <li><CheckCheck size={16} strokeWidth={2} color="var(--color-primary)" /><span>Built-in regulatory checks for all investors.</span></li>
              <li><CheckCheck size={16} strokeWidth={2} color="var(--color-primary)" /><span>Make commercial equity easier to trade.</span></li>
              <li><CheckCheck size={16} strokeWidth={2} color="var(--color-primary)" /><span>Manage stakeholder voting via smart contracts.</span></li>
            </ul>
            <button className="btn btn--cta">Partner With Us</button>
          </div>
        </div>
      </Section>
    </>
  )
}

export default TargetAudience
