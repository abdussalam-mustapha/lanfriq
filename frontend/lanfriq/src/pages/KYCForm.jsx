import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Globe, ArrowLeft, Upload, Info } from 'lucide-react'
import logo from '../assets/logo.png'
import logoWhite from '../assets/lanfriqnavlogowhite.png'
import { useTheme } from '../context/ThemeContext'
import './KYCForm.css'

const KYCForm = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    // Step 1: Profile & Contact
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    dob: '',
    country: 'Nigeria',
    
    // Step 2: Personal Information
    idType: '',
    idNumber: '',
    idFront: null,
    idBack: null,
    
    // Step 3: Address Proof
    utilityBill: '',
    utilityBillFile: null,
    addressCountry: 'Nigeria',
    state: 'Oyo',
    city: 'Ibadan',
    streetAddress: ''
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0]
    if (file) {
      setFormData(prev => ({ ...prev, [fieldName]: file }))
    }
  }

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1)
    } else {
      // Submit KYC
      handleSubmit()
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    } else {
      navigate('/verification')
    }
  }

  const handleSubmit = () => {
    // Handle KYC submission
    console.log('Submitting KYC:', formData)
    navigate('/kyc-success')
  }

  const renderStepIndicator = () => (
    <div className="kyc-form__steps">
      {[1, 2, 3].map((step) => (
        <div key={step} className="kyc-form__step-wrapper">
          <div className={`kyc-form__step ${currentStep >= step ? 'active' : ''}`}>
            {step}
          </div>
          {step < 3 && <div className="kyc-form__step-line" />}
        </div>
      ))}
    </div>
  )

  const renderStep1 = () => (
    <div className="kyc-form__content">
      <h2 className="kyc-form__title">Profile & Contact</h2>
      <p className="kyc-form__description">
        We'll use this info to contact you about verification & SPV paperwork.
      </p>

      <div className="kyc-form__fields">
        <div className="kyc-form__row">
          <div className="kyc-form__field">
            <label className="kyc-form__label">Legal first name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              placeholder="e.g baskey"
              className="kyc-form__input"
            />
          </div>
          <div className="kyc-form__field">
            <label className="kyc-form__label">Legal second name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              placeholder="e.g baskey koer"
              className="kyc-form__input"
            />
          </div>
        </div>

        <div className="kyc-form__row">
          <div className="kyc-form__field">
            <label className="kyc-form__label">Email address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="e.g baskeykoer@gmail.com"
              className="kyc-form__input"
            />
          </div>
          <div className="kyc-form__field">
            <label className="kyc-form__label">Phone number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="e.g +234 913 993 7486"
              className="kyc-form__input"
            />
          </div>
        </div>

        <div className="kyc-form__row">
          <div className="kyc-form__field">
            <label className="kyc-form__label">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="kyc-form__select"
            >
              <option value="">Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="kyc-form__field">
            <label className="kyc-form__label">Date of birth</label>
            <input
              type="date"
              name="dob"
              value={formData.dob}
              onChange={handleInputChange}
              placeholder="MM/DD/YYYY"
              className="kyc-form__input"
            />
          </div>
        </div>

        <div className="kyc-form__field">
          <label className="kyc-form__label">Country</label>
          <select
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="kyc-form__select"
          >
            <option value="Nigeria">Nigeria</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
          </select>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="kyc-form__content">
      <h2 className="kyc-form__title">Personal information</h2>
      <p className="kyc-form__description">
        Ensure every details provided is of same as the information on the means of identification being provided
      </p>

      <div className="kyc-form__fields">
        <div className="kyc-form__field">
          <label className="kyc-form__label">
            Means of identification
            <Info size={16} className="kyc-form__label-icon" />
          </label>
          <select
            name="idType"
            value={formData.idType}
            onChange={handleInputChange}
            className="kyc-form__select"
          >
            <option value="">National Identification Number - NIN</option>
            <option value="BVN">Bank Verification Number - BVN</option>
            <option value="SSN">Social Security Number - SSN</option>
            <option value="National ID">National ID</option>
          </select>
        </div>

        <div className="kyc-form__field">
          <label className="kyc-form__label">Identification no.</label>
          <input
            type="text"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleInputChange}
            placeholder="e.g 6295 028 3868"
            className="kyc-form__input"
          />
        </div>

        <div className="kyc-form__field">
          <label className="kyc-form__label">Upload the (front) of your ID Card</label>
          <div className="kyc-form__upload">
            <input
              type="file"
              id="idFront"
              onChange={(e) => handleFileChange(e, 'idFront')}
              className="kyc-form__upload-input"
              accept="image/*"
            />
            <label htmlFor="idFront" className="kyc-form__upload-area">
              <Upload size={24} />
              <p>
                Drag and drop to upload files or <span className="kyc-form__upload-link">browse</span>
              </p>
            </label>
            {formData.idFront && (
              <p className="kyc-form__upload-filename">{formData.idFront.name}</p>
            )}
          </div>
        </div>

        <div className="kyc-form__field">
          <label className="kyc-form__label">Upload the (back) of your ID Card</label>
          <div className="kyc-form__upload">
            <input
              type="file"
              id="idBack"
              onChange={(e) => handleFileChange(e, 'idBack')}
              className="kyc-form__upload-input"
              accept="image/*"
            />
            <label htmlFor="idBack" className="kyc-form__upload-area">
              <Upload size={24} />
              <p>
                Drag and drop to upload files or <span className="kyc-form__upload-link">browse</span>
              </p>
            </label>
            {formData.idBack && (
              <p className="kyc-form__upload-filename">{formData.idBack.name}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="kyc-form__content">
      <h2 className="kyc-form__title">Address Proof</h2>
      <p className="kyc-form__description">
        Ensure every details provided is of same as the information on the means of identification being provided
      </p>

      <div className="kyc-form__fields">
        <div className="kyc-form__field">
          <label className="kyc-form__label">Utility Bill</label>
          <select
            name="utilityBill"
            value={formData.utilityBill}
            onChange={handleInputChange}
            className="kyc-form__select"
          >
            <option value="">Choose the utility bil you want to provide</option>
            <option value="electricity">Electricity Bill</option>
            <option value="water">Water Bill</option>
            <option value="gas">Gas Bill</option>
          </select>
        </div>

        <div className="kyc-form__field">
          <label className="kyc-form__label">Upload a clear picture of your utility bill</label>
          <div className="kyc-form__upload">
            <input
              type="file"
              id="utilityBillFile"
              onChange={(e) => handleFileChange(e, 'utilityBillFile')}
              className="kyc-form__upload-input"
              accept="image/*,application/pdf"
            />
            <label htmlFor="utilityBillFile" className="kyc-form__upload-area">
              <Upload size={24} />
              <p>
                Drag and drop to upload files or <span className="kyc-form__upload-link">browse</span>
              </p>
            </label>
            {formData.utilityBillFile && (
              <p className="kyc-form__upload-filename">{formData.utilityBillFile.name}</p>
            )}
          </div>
        </div>

        <div className="kyc-form__row">
          <div className="kyc-form__field">
            <label className="kyc-form__label">Country</label>
            <select
              name="addressCountry"
              value={formData.addressCountry}
              onChange={handleInputChange}
              className="kyc-form__select"
            >
              <option value="Nigeria">Nigeria</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
            </select>
          </div>
          <div className="kyc-form__field">
            <label className="kyc-form__label">State / Province</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              className="kyc-form__select"
            >
              <option value="Oyo">Oyo</option>
              <option value="Lagos">Lagos</option>
              <option value="Abuja">Abuja</option>
            </select>
          </div>
        </div>

        <div className="kyc-form__row">
          <div className="kyc-form__field">
            <label className="kyc-form__label">City / Town</label>
            <select
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              className="kyc-form__select"
            >
              <option value="Ibadan">Ibadan</option>
              <option value="Lagos">Lagos</option>
              <option value="Abuja">Abuja</option>
            </select>
          </div>
          <div className="kyc-form__field">
            <label className="kyc-form__label">Street Address</label>
            <input
              type="text"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleInputChange}
              placeholder="e.g E4/8176, Oluwo, Egbeda."
              className="kyc-form__input"
            />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="kyc-form">
      <div className="kyc-form__header">
        <div className="kyc-form__logo">
          <img src={theme === 'dark' ? logoWhite : logo} alt="Lanfriq" className="kyc-form__logo-img" />
        </div>
        <div className="kyc-form__language">
          <Globe size={18} />
          <span>English (UK)</span>
        </div>
      </div>

      <div className="kyc-form__container">
        {renderStepIndicator()}

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}

        <div className="kyc-form__actions">
          <button className="kyc-form__btn kyc-form__btn--back" onClick={handleBack}>
            <ArrowLeft size={20} />
            Back
          </button>
          <button className="kyc-form__btn kyc-form__btn--primary" onClick={handleNext}>
            {currentStep === 3 ? 'Submit KYC' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default KYCForm
