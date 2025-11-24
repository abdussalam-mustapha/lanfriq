import Section from '../ui/Section'
import Card from '../ui/Card'
import spvBackedOwnership from '../../assets/SPVBackedOwnership.png'
import fractionalInvesting from '../../assets/fractionalInvesting.png'
import earnFromRealProperties from '../../assets/EarnFromRealProperties.png'
import transparentValuation from '../../assets/transparentValuation.png'
import nftOwnershipReceipt from '../../assets/NFTOwnershipReceipt.png'
import secureVerificationWorkflow from '../../assets/SecureVerificationWorkflow.png'
import './Features.css'

const Features = () => {
  const features = [
    {
      image: spvBackedOwnership,
      title: 'SPV-Backed Ownership',
      description: 'Tokens represent real, legal ownership secured by a certified SPV.'
    },
    {
      image: transparentValuation,
      title: 'Transparent Valuation',
      description: 'Professional valuers ensure investors always know true asset value.'
    },
    {
      image: fractionalInvesting,
      title: 'Fractional Investing',
      description: 'Get real estate exposure with low entry amounts.'
    },
    {
      image: nftOwnershipReceipt,
      title: 'NFT Ownership Receipts',
      description: 'Instant, tamper-proof, and transferable proof of investment.'
    },
    {
      image: earnFromRealProperties,
      title: 'Earn From Real Properties',
      description: 'Get rental income and appreciation returns automatically.'
    },
    {
      image: secureVerificationWorkflow,
      title: 'Secure Verification Workflow',
      description: 'No fraud — all property documents are validated by experts.'
    }
  ]

  return (
    <Section id="benefits" variant="alt" className="features">
      <div className="features__header">
        <div className="features__label">
          <span className="features__label-line"></span>
          <span className="features__label-text">Benefits</span>
          <span className="features__label-line"></span>
        </div>
        <h2 className="features__title">Unlock your equity with Lanfriq</h2>
      </div>
      
      <div className="features__grid">
        {features.map((feature, index) => (
          <Card key={index} variant="feature" className="feature-card">
            <div className="feature-card__image">
              <img src={feature.image} alt={feature.title} />
            </div>
            <h3 className="feature-card__title">{feature.title}</h3>
            <p className="feature-card__description">{feature.description}</p>
          </Card>
        ))}
      </div>
    </Section>
  )
}

export default Features
