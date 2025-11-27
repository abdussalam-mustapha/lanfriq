import { useTheme } from '../../context/ThemeContext'
import Section from '../ui/Section'
import Card from '../ui/Card'
import addProperty from '../../assets/addProperty.png'
import addPropertyLight from '../../assets/addPropertyLight.png'
import verifyAndAppraise from '../../assets/verifyAndAppraise.png'
import verifyAndAppraiseLight from '../../assets/verifyAndAppraiseLight.png'
import createSPVAndTokenize from '../../assets/createSPVAdTokenize.png'
import createSPVAndTokenizeLight from '../../assets/createSPVAndTokenizeLight.png'
import investorBuyToken from '../../assets/investoesBuyToken.png'
import investorBuyTokenLight from '../../assets/InvestorBuyTokenLight.png'
import earnAndTrade from '../../assets/EarnAndTrade.png'
import earnAndTradeLight from '../../assets/EarnAndTradeLight.png'
import './HowItWorks.css'

const HowItWorks = () => {
  const { theme } = useTheme()
  
  const steps = [
    {
      title: 'Add Property',
      description: 'Owners upload property details and required documents.',
      imageLight: addPropertyLight,
      imageDark: addProperty
    },
    {
      title: 'Verify & Appraise',
      description: 'Certified surveyors and valuers confirm the property and assign a real valuation.',
      imageLight: verifyAndAppraiseLight,
      imageDark: verifyAndAppraise
    },
    {
      title: 'Create SPV & Tokenize',
      description: 'Lanfriq sets up an SPV and divides the property value into digital tokens.',
      imageLight: createSPVAndTokenizeLight,
      imageDark: createSPVAndTokenize
    },
    {
      title: 'Investors Buy Tokens',
      description: 'People purchase fractional shares and receive NFT receipts as proof.',
      imageLight: investorBuyTokenLight,
      imageDark: investorBuyToken
    },
    {
      title: 'Earn & Trade',
      description: 'Investors receive profits and can resell tokens anytime.',
      imageLight: earnAndTradeLight,
      imageDark: earnAndTrade
    }
  ]

  return (
    <Section id="how-it-works" variant="default" className="how-it-works">
      <div className="how-it-works__header">
        <div className="how-it-works__label">
          <span className="how-it-works__label-line"></span>
          <span className="how-it-works__label-text">How It Works</span>
          <span className="how-it-works__label-line"></span>
        </div>
        <h2 className="how-it-works__title">Simple steps in tokenizing an asset</h2>
      </div>
      
      <div className="how-it-works__grid">
        {steps.map((step, index) => {
          const stepImage = theme === 'light' ? step.imageLight : step.imageDark
          
          return (
            <div key={index} className="step-card">
              <div className="step-card__image">
                <img src={stepImage} alt={step.title} />
              </div>
              <h3 className="step-card__title">{step.title}</h3>
              <p className="step-card__description">{step.description}</p>
            </div>
          )
        })}
      </div>
    </Section>
  )
}

export default HowItWorks
