import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Globe, ArrowLeft, Upload, Plus, X } from 'lucide-react'
import logo from '../assets/logo.png'
import logoWhite from '../assets/lanfriqnavlogowhite.png'
import { useTheme } from '../context/ThemeContext'
import './KYBForm.css'

const KYBForm = () => {
  const navigate = useNavigate()
  const { theme } = useTheme()
  const [currentStep, setCurrentStep] = useState(1)
  const [directors, setDirectors] = useState([{
    id: 1,
    fullName: '',
    email: '',
    phone: '',
    country: 'Nigeria',
    role: '',
    idType: '',
    idNumber: '',
    idFile: null
  }])
  const [formData, setFormData] = useState({
    // Step 1: Company Info
    businessName: '',
    registrationNumber: '',
    tin: '',
    businessCertificate: null,
    
    // Step 2: Company Address & Contact
    businessEmail: '',
    businessPhone: '',
    registeredAddress: '',
    website: '',
    
    // Step 4: Business Documents
    incorporationCert: null,
    memorandum: null,
    bankStatement: null
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

  const handleDirectorChange = (id, field, value) => {
    setDirectors(prev => prev.map(director => 
      director.id === id ? { ...director, [field]: value } : director
    ))
  }

  const handleDirectorFileChange = (id, file) => {
    setDirectors(prev => prev.map(director => 
      director.id === id ? { ...director, idFile: file } : director
    ))
  }

  const addDirector = () => {
    setDirectors(prev => [...prev, {
      id: Date.now(),
      fullName: '',
      email: '',
      phone: '',
      country: 'Nigeria',
      role: '',
      idType: '',
      idNumber: '',
      idFile: null
    }])
  }

  const removeDirector = (id) => {
    if (directors.length > 1) {
      setDirectors(prev => prev.filter(director => director.id !== id))
    }
  }

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1)
    } else {
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
    console.log('Submitting KYB:', { formData, directors })
    navigate('/kyc-success')
  }

  const renderStepIndicator = () => (
    <div className="kyb-form__steps">
      {[1, 2, 3, 4].map((step) => (
        <div key={step} className="kyb-form__step-wrapper">
          <div className={`kyb-form__step ${currentStep >= step ? 'active' : ''}`}>
            {step}
          </div>
          {step < 4 && <div className="kyb-form__step-line" />}
        </div>
      ))}
    </div>
  )

  const renderStep1 = () => (
    <div className="kyb-form__content">
      <h2 className="kyb-form__title">Company Info</h2>

      <div className="kyb-form__fields">
        <div className="kyb-form__field">
          <label className="kyb-form__label">Business name (as registered)</label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleInputChange}
            placeholder="e.g baskey koer"
            className="kyb-form__input"
          />
        </div>

        <div className="kyb-form__row">
          <div className="kyb-form__field">
            <label className="kyb-form__label">Registration number (CAC or local)</label>
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleInputChange}
              placeholder="e.g baskey"
              className="kyb-form__input"
            />
          </div>
          <div className="kyb-form__field">
            <label className="kyb-form__label">Tax Identity Number (TIN)</label>
            <input
              type="text"
              name="tin"
              value={formData.tin}
              onChange={handleInputChange}
              placeholder="e.g baskey"
              className="kyb-form__input"
            />
          </div>
        </div>

        <div className="kyb-form__field">
          <label className="kyb-form__label">Upload business certificate</label>
          <div className="kyb-form__upload">
            <input
              type="file"
              id="businessCertificate"
              onChange={(e) => handleFileChange(e, 'businessCertificate')}
              className="kyb-form__upload-input"
              accept="image/*,application/pdf"
            />
            <label htmlFor="businessCertificate" className="kyb-form__upload-area">
              <Upload size={28} strokeWidth={1.5} />
              <p>
                Drag and drop to upload files or <span className="kyb-form__upload-link">browse</span>
              </p>
            </label>
            {formData.businessCertificate && (
              <p className="kyb-form__upload-filename">{formData.businessCertificate.name}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="kyb-form__content">
      <h2 className="kyb-form__title">Company Address & Contact</h2>

      <div className="kyb-form__fields">
        <div className="kyb-form__field">
          <label className="kyb-form__label">Business email</label>
          <input
            type="email"
            name="businessEmail"
            value={formData.businessEmail}
            onChange={handleInputChange}
            placeholder="e.g baskey"
            className="kyb-form__input"
          />
        </div>

        <div className="kyb-form__row">
          <div className="kyb-form__field">
            <label className="kyb-form__label">Business phone no.</label>
            <input
              type="tel"
              name="businessPhone"
              value={formData.businessPhone}
              onChange={handleInputChange}
              placeholder="e.g baskey"
              className="kyb-form__input"
            />
          </div>
          <div className="kyb-form__field">
            <label className="kyb-form__label">Registered address</label>
            <input
              type="text"
              name="registeredAddress"
              value={formData.registeredAddress}
              onChange={handleInputChange}
              placeholder="e.g baskey"
              className="kyb-form__input"
            />
          </div>
        </div>

        <div className="kyb-form__field">
          <label className="kyb-form__label">Website</label>
          <input
            type="url"
            name="website"
            value={formData.website}
            onChange={handleInputChange}
            placeholder="e.g baskey"
            className="kyb-form__input"
          />
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="kyb-form__content">
      <h2 className="kyb-form__title">Directors & Beneficial Owners</h2>
      <p className="kyb-form__description">List only people with >25% share</p>

      {directors.map((director, index) => (
        <div key={director.id} className="kyb-form__director-card">
          <div className="kyb-form__director-header">
            <span className="kyb-form__director-number">{index + 1}</span>
            <span className="kyb-form__director-label">Owner Information</span>
            {directors.length > 1 && (
              <button
                className="kyb-form__director-remove"
                onClick={() => removeDirector(director.id)}
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="kyb-form__fields">
            <div className="kyb-form__field">
              <label className="kyb-form__label">Legal full name</label>
              <input
                type="text"
                value={director.fullName}
                onChange={(e) => handleDirectorChange(director.id, 'fullName', e.target.value)}
                placeholder="e.g baskey"
                className="kyb-form__input"
              />
            </div>

            <div className="kyb-form__row">
              <div className="kyb-form__field">
                <label className="kyb-form__label">Email address</label>
                <input
                  type="email"
                  value={director.email}
                  onChange={(e) => handleDirectorChange(director.id, 'email', e.target.value)}
                  placeholder="e.g baskeykoer@gmail.com"
                  className="kyb-form__input"
                />
              </div>
              <div className="kyb-form__field">
                <label className="kyb-form__label">Phone number</label>
                <input
                  type="tel"
                  value={director.phone}
                  onChange={(e) => handleDirectorChange(director.id, 'phone', e.target.value)}
                  placeholder="e.g +234 913 993 7486"
                  className="kyb-form__input"
                />
              </div>
            </div>

            <div className="kyb-form__row">
              <div className="kyb-form__field">
                <label className="kyb-form__label">Country</label>
                <select
                  value={director.country}
                  onChange={(e) => handleDirectorChange(director.id, 'country', e.target.value)}
                  className="kyb-form__select"
                >
                  <option value="Nigeria">Nigeria</option>
                  <option value="USA">USA</option>
                  <option value="UK">UK</option>
                </select>
              </div>
              <div className="kyb-form__field">
                <label className="kyb-form__label">Role</label>
                <select
                  value={director.role}
                  onChange={(e) => handleDirectorChange(director.id, 'role', e.target.value)}
                  className="kyb-form__select"
                >
                  <option value="">CEO</option>
                  <option value="Director">Director</option>
                  <option value="CFO">CFO</option>
                  <option value="COO">COO</option>
                </select>
              </div>
            </div>

            <div className="kyb-form__row">
              <div className="kyb-form__field">
                <label className="kyb-form__label">Means of identification</label>
                <select
                  value={director.idType}
                  onChange={(e) => handleDirectorChange(director.id, 'idType', e.target.value)}
                  className="kyb-form__select"
                >
                  <option value="">National Identification Number - NIN</option>
                  <option value="BVN">Bank Verification Number - BVN</option>
                  <option value="SSN">Social Security Number - SSN</option>
                </select>
              </div>
              <div className="kyb-form__field">
                <label className="kyb-form__label">Identification no.</label>
                <input
                  type="text"
                  value={director.idNumber}
                  onChange={(e) => handleDirectorChange(director.id, 'idNumber', e.target.value)}
                  placeholder="e.g 6295 028 3868"
                  className="kyb-form__input"
                />
              </div>
            </div>

            <div className="kyb-form__field">
              <label className="kyb-form__label">Upload ID</label>
              <div className="kyb-form__upload">
                <input
                  type="file"
                  id={`directorId-${director.id}`}
                  onChange={(e) => handleDirectorFileChange(director.id, e.target.files[0])}
                  className="kyb-form__upload-input"
                  accept="image/*,application/pdf"
                />
                <label htmlFor={`directorId-${director.id}`} className="kyb-form__upload-area">
                  <Upload size={28} strokeWidth={1.5} />
                  <p>
                    Drag and drop to upload files or <span className="kyb-form__upload-link">browse</span>
                  </p>
                </label>
                {director.idFile && (
                  <p className="kyb-form__upload-filename">{director.idFile.name}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      <button className="kyb-form__add-director" onClick={addDirector}>
        <Plus size={20} />
        Add More
      </button>
    </div>
  )

  const renderStep4 = () => (
    <div className="kyb-form__content">
      <h2 className="kyb-form__title">Business Documents</h2>

      <div className="kyb-form__fields">
        <div className="kyb-form__field">
          <label className="kyb-form__label">Certificate of incorporation</label>
          <div className="kyb-form__upload">
            <input
              type="file"
              id="incorporationCert"
              onChange={(e) => handleFileChange(e, 'incorporationCert')}
              className="kyb-form__upload-input"
              accept="image/*,application/pdf"
            />
            <label htmlFor="incorporationCert" className="kyb-form__upload-area">
              <Upload size={28} strokeWidth={1.5} />
              <p>
                Drag and drop to upload files or <span className="kyb-form__upload-link">browse</span>
              </p>
            </label>
            {formData.incorporationCert && (
              <p className="kyb-form__upload-filename">{formData.incorporationCert.name}</p>
            )}
          </div>
        </div>

        <div className="kyb-form__field">
          <label className="kyb-form__label">Memorandum & Articles (if applicable)</label>
          <div className="kyb-form__upload">
            <input
              type="file"
              id="memorandum"
              onChange={(e) => handleFileChange(e, 'memorandum')}
              className="kyb-form__upload-input"
              accept="image/*,application/pdf"
            />
            <label htmlFor="memorandum" className="kyb-form__upload-area">
              <Upload size={28} strokeWidth={1.5} />
              <p>
                Drag and drop to upload files or <span className="kyb-form__upload-link">browse</span>
              </p>
            </label>
            {formData.memorandum && (
              <p className="kyb-form__upload-filename">{formData.memorandum.name}</p>
            )}
          </div>
        </div>

        <div className="kyb-form__field">
          <label className="kyb-form__label">Recent bank statement</label>
          <div className="kyb-form__upload">
            <input
              type="file"
              id="bankStatement"
              onChange={(e) => handleFileChange(e, 'bankStatement')}
              className="kyb-form__upload-input"
              accept="image/*,application/pdf"
            />
            <label htmlFor="bankStatement" className="kyb-form__upload-area">
              <Upload size={28} strokeWidth={1.5} />
              <p>
                Drag and drop to upload files or <span className="kyb-form__upload-link">browse</span>
              </p>
            </label>
            {formData.bankStatement && (
              <p className="kyb-form__upload-filename">{formData.bankStatement.name}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="kyb-form">
      <div className="kyb-form__header">
        <div className="kyb-form__logo">
          <img src={theme === 'dark' ? logoWhite : logo} alt="Lanfriq" className="kyb-form__logo-img" />
        </div>
        <div className="kyb-form__language">
          <Globe size={18} />
          <span>English (UK)</span>
        </div>
      </div>

      <div className="kyb-form__container">
        {renderStepIndicator()}

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}

        <div className="kyb-form__actions">
          <button className="kyb-form__btn kyb-form__btn--back" onClick={handleBack}>
            <ArrowLeft size={20} />
            Back
          </button>
          <button className="kyb-form__btn kyb-form__btn--primary" onClick={handleNext}>
            {currentStep === 4 ? 'Submit KYB' : 'Continue'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default KYBForm
