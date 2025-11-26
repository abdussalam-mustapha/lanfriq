import { useState } from 'react'
import { Eye, BarChart3, Coins, Plus } from 'lucide-react'
import PropertySubmissionModal from '../../components/modals/PropertySubmissionModal'
import VerificationFeeModal from '../../components/modals/VerificationFeeModal'
import PropertySubmittedModal from '../../components/modals/PropertySubmittedModal'
import SPVSetupModal from '../../components/modals/SPVSetupModal'
import SuccessModal from '../../components/modals/SuccessModal'
import TokenSetupScreen from '../../components/modals/TokenSetupScreen'
import './TokenizationHub.css'

const TokenizationHub = () => {
  const [showModal, setShowModal] = useState(false)
  const [showFeeModal, setShowFeeModal] = useState(false)
  const [showSubmittedModal, setShowSubmittedModal] = useState(false)
  const [showSPVModal, setShowSPVModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showTokenSetup, setShowTokenSetup] = useState(false)
  const [assetImage, setAssetImage] = useState(null)

  const spvData = [
    { name: 'Additech - Digital', type: 'Real - Estate', value: '$10,000', status: 'Pending' },
    { name: 'Jays - Investment', type: 'Real - Estate', value: '$10,000', status: 'Approved' }
  ]

  const handlePropertySubmit = (formData, teamMembers) => {
    // Store asset image for token setup
    if (formData.assetImage) {
      const imageUrl = URL.createObjectURL(formData.assetImage)
      setAssetImage(imageUrl)
    }
    
    console.log('Property submitted:', formData, teamMembers)
    setShowModal(false)
    setShowFeeModal(true)
  }

  const handlePayment = () => {
    setShowFeeModal(false)
    setShowSubmittedModal(true)
  }

  const handleViewStatus = () => {
    setShowSubmittedModal(false)
    setShowSPVModal(true)
  }

  const handleBrowseMarket = () => {
    setShowSubmittedModal(false)
    // Navigate to marketplace
  }

  const handleGenerateSPV = () => {
    setShowSPVModal(false)
    setShowSuccessModal(true)
  }

  const handleContinueToToken = () => {
    setShowSuccessModal(false)
    setShowTokenSetup(true)
  }

  const handlePublish = (tokenData) => {
    console.log('Publishing token...', tokenData)
    setShowTokenSetup(false)
    // Handle publish logic and navigate to success page
  }

  return (
    <div className="tokenization-hub">
      <div className="tokenization-hub__header">
        <div className="tokenization-hub__icon">
          <Coins size={24} />
        </div>
        <h1 className="tokenization-hub__title">Asset</h1>
      </div>

      {/* Hero Section */}
      <div className="tokenization-hub__hero">
        <div className="tokenization-hub__hero-content">
          <h2>Create, manage, and monitor your tokenized properties and SPV activities in one place.</h2>
          <button className="tokenization-hub__cta-btn" onClick={() => setShowModal(true)}>
            Create & Tokenize <Plus size={18} />
          </button>
        </div>
      </div>

      {/* Action Cards */}
      <div className="tokenization-hub__cards">
        <div className="tokenization-hub__card">
          <div className="tokenization-hub__card-icon">
            <Eye size={24} />
          </div>
          <div className="tokenization-hub__card-content">
            <h3>See all your SPV here</h3>
            <p>See all the SPV you have created here</p>
          </div>
        </div>
        <div className="tokenization-hub__card">
          <div className="tokenization-hub__card-icon">
            <BarChart3 size={24} />
          </div>
          <div className="tokenization-hub__card-content">
            <h3>SPV Reports</h3>
            <p>See all the SPV reports</p>
          </div>
        </div>
        <div className="tokenization-hub__card">
          <div className="tokenization-hub__card-icon">
            <Coins size={24} />
          </div>
          <div className="tokenization-hub__card-content">
            <h3>Tokenize Assets</h3>
            <p>View all your tokenize assets here</p>
          </div>
        </div>
      </div>

      {/* My SPVs Table */}
      <div className="tokenization-hub__spvs">
        <div className="tokenization-hub__spvs-header">
          <h3>My SPVs</h3>
          <button className="tokenization-hub__filter-btn">
            Filters <span className="tokenization-hub__filter-icon">⚙</span>
          </button>
        </div>
        <table className="tokenization-hub__table">
          <thead>
            <tr>
              <th>SPV Name</th>
              <th>Asset types</th>
              <th>Asset values</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {spvData.map((spv, index) => (
              <tr key={index}>
                <td>{spv.name}</td>
                <td>{spv.type}</td>
                <td>{spv.value}</td>
                <td>
                  <span className={`tokenization-hub__status tokenization-hub__status--${spv.status.toLowerCase()}`}>
                    {spv.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* All Modals */}
      <PropertySubmissionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handlePropertySubmit}
      />

      <VerificationFeeModal
        isOpen={showFeeModal}
        onClose={() => setShowFeeModal(false)}
        onPayment={handlePayment}
      />

      <PropertySubmittedModal
        isOpen={showSubmittedModal}
        onViewStatus={handleViewStatus}
        onBrowseMarket={handleBrowseMarket}
      />

      <SPVSetupModal
        isOpen={showSPVModal}
        onClose={() => setShowSPVModal(false)}
        onGenerate={handleGenerateSPV}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        onContinue={handleContinueToToken}
      />

      <TokenSetupScreen
        isOpen={showTokenSetup}
        onClose={() => setShowTokenSetup(false)}
        onPublish={handlePublish}
        assetImage={assetImage}
      />
    </div>
  )
}

