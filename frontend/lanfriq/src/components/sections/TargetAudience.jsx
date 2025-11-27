import { useTheme } from '../../context/ThemeContext'
import { CheckCheck } from 'lucide-react'
import Section from '../ui/Section'
import investorImg from '../../assets/WhoIsItForInvestor.png'
import propertyOwnerImg from '../../assets/whoIsItForPropertyOwner.png'
import businessImg from '../../assets/WhoIsItForBusinessAndFirms.png'
import professionalSurveyLight from '../../assets/professionalSurveyLight.png'
import professionalSurveyDark from '../../assets/professionalSurveyDark.png'
import './TargetAudience.css'
import { motion } from "motion/react";


const TargetAudience = () => {
  const fadeUp = {
    initial: { opacity: 0, y: 40 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const listItem = {
    initial: { opacity: 0, x: -20 },
    animate: i => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.15 }
    })
  };

  const zoomIn = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
  };


  const { theme } = useTheme()
  const professionalSurveyImg = theme === 'light' ? professionalSurveyLight : professionalSurveyDark

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
          <div className="audience-section__image mobile_show">
        <div className="audience-section__content">
          <div className="audience-section__image">
            <img src={investorImg} alt="Investors" />
          </div>
          <motion.div
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="audience-section__text"
          >
            <h2 className="audience-section__title">Investors</h2>
            <p className="audience-section__description">
              Invest in real estate without needing large capital. Buy fractional property tokens, earn returns from property performance, and track your portfolio with full transparency.
            </p>
            <ul className="audience-section__features">
              <li>
                <CheckCheck size={16} strokeWidth={2} color="var(--color-primary)" /> 
                <span>
                  Buy fractional property tokens
                </span>
              </li>
              <li>
                <CheckCheck size={16} strokeWidth={2} color="var(--color-primary)" />
                <span>
                  Receive NFT receipts as proof of ownership
                </span>
              </li>
              <li>
                <CheckCheck size={16} strokeWidth={2} color="var(--color-primary)" />
                <span>
                  Earn returns from rental income or appreciation
                </span>
              </li>
              <li>
                <CheckCheck size={16} strokeWidth={2} color="var(--color-primary)" />
                <span>
                  Resell tokens whenever you choose
                </span>
              </li>
            </ul>
            <button className="btn btn--cta">
              Start Investing
            </button>
          </motion.div>
          <div className="audience-section__image mobile_hide">
            <motion.img
              src={investorImg}
              alt="Investors"
              variants={zoomIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            />

          </div>
        </div>
      </Section>

      {/* Property Owners Section */}
      <Section id="property-owners" variant="default" className="audience-section">
        <div className="audience-section__content">
          <div className="audience-section__image mobile_show">
            <img src={propertyOwnerImg} alt="Property Owners" />
          </div>
          <motion.div
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="audience-section__text"
          >
            <h2 className="audience-section__title">Property Owners</h2>
            <p className="audience-section__description">
              Turn your physical property into digital tokens so you can raise funds, share ownership, or sell faster. Keep full visibility over investor activity and profit distribution.
            </p>
            <ul className="audience-section__features">
              <li>
                <CheckCheck size={16} strokeWidth={2} color="var(--color-primary)" />
                <span>
                  Upload and verify your property
                </span>
              </li>
              <li>
                <CheckCheck size={16} strokeWidth={2} color="var(--color-primary)" />
                <span>
                  Get professional valuation
                </span>
              </li>
              <li>
                <CheckCheck size={16} strokeWidth={2} color="var(--color-primary)" />
                <span>
                  Sell fractions to investors for capital
                </span>
              </li>
              <li>
                <CheckCheck size={16} strokeWidth={2} color="var(--color-primary)" />
                <span>
                  Tokenize the asset through an SPV
                </span>
              </li>
              <li>
                <CheckCheck size={16} strokeWidth={2} color="var(--color-primary)" />
                <span>
                  Manage profit updates and property performance
                </span>
              </li>
            </ul>
            <button className="btn btn--cta">Tokenize Your Home</button>
          </motion.div>
          <div className="audience-section__image mobile_hide">
            <motion.img
              src={propertyOwnerImg}
              alt="Property Owners"
              variants={zoomIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            />
          </div>
        </div>
      </Section>

      {/* Businesses & Firms Section */}
      <Section id="businesses" variant="default" className="audience-section">
        <div className="audience-section__content">
          <div className="audience-section__image">
            <motion.img
              src={businessImg}
              alt="Businesses and Firms"
              variants={zoomIn}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            />
          </div>
          <motion.div
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="audience-section__text"
          >
            <h2 className="audience-section__title">Businesses & Firms</h2>
            <p className="audience-section__description">
              Tokenize commercial properties to unlock liquidity and attract multiple investors. Ideal for companies wanting to raise capital while keeping full structural control of their assets.
            </p>
            <ul className="audience-section__features">
              <li>
                <CheckCheck size={16} strokeWidth={2} color="var(--color-primary)" />
                <span>
                  Convert commercial buildings into fractional tokens
                </span>
              </li>
              <li>
                <CheckCheck size={16} strokeWidth={2} color="var(--color-primary)" />
                <span>
                  Raise capital without selling entire assets
                </span>
              </li>
              <li>
                <CheckCheck size={16} strokeWidth={2} color="var(--color-primary)" />
                <span>
                  Automate profit distribution to investors
                </span>
              </li>
              <li>
                <CheckCheck size={16} strokeWidth={2} color="var(--color-primary)" />
                <span>
                  Track ownership and investor activity
                </span>
              </li>
              <li>
                <CheckCheck size={16} strokeWidth={2} color="var(--color-primary)" />
                <span>
                  Increase liquidity for long-term projects
                </span>
              </li>
            </ul>
            <button className="btn btn--cta">Tokenize your Properties</button>
          </motion.div>
        </div>
      </Section>

      {/* Professional Survey Section */}
      <Section id="professional-survey" variant="default" className="audience-section">
        <div className="audience-section__content">
          <div className="audience-section__text">
            <h2 className="audience-section__title">Professional Survey</h2>
            <p className="audience-section__description">
              Expert property valuations and verification. Our certified surveyors conduct comprehensive assessments to ensure accurate property valuation, compliance verification, and investment security for all stakeholders.
            </p>
            <ul className="audience-section__features">
              <li><CheckCheck size={16} strokeWidth={2} color="var(--color-primary)" /><span>Certified professional surveyors.</span></li>
              <li><CheckCheck size={16} strokeWidth={2} color="var(--color-primary)" /><span>Comprehensive property assessment reports.</span></li>
              <li><CheckCheck size={16} strokeWidth={2} color="var(--color-primary)" /><span>Legal compliance verification.</span></li>
              <li><CheckCheck size={16} strokeWidth={2} color="var(--color-primary)" /><span>Real-time valuation updates.</span></li>
            </ul>
            <button className="btn btn--cta">Join Us</button>
          </div>
          <div className="audience-section__image">
            <img src={professionalSurveyImg} alt="Professional Survey" />
          </div>
        </div>
      </Section>
    </>
  )
}

export default TargetAudience
