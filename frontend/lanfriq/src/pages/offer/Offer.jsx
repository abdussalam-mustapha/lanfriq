import { useState } from 'react'
import { Upload, Plus, X, Building2, MapPin, DollarSign, Calendar, FileText } from 'lucide-react'
import './Offer.css'

const Offer = () => {
  const [formData, setFormData] = useState({
    propertyName: '',
    propertyType: '',
    location: '',
    address: '',
    price: '',
    tokenSupply: '',
    minimumInvestment: '',
    expectedReturn: '',
    projectDuration: '',
    description: '',
    features: [''],
    documents: []
  })

  const [previewImages, setPreviewImages] = useState([])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleFeatureChange = (index, value) => {
    const newFeatures = [...formData.features]
    newFeatures[index] = value
    setFormData(prev => ({
      ...prev,
      features: newFeatures
    }))
  }

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }))
  }

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const newImages = files.map(file => URL.createObjectURL(file))
    setPreviewImages(prev => [...prev, ...newImages])
  }

  const removeImage = (index) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files)
    setFormData(prev => ({
      ...prev,
      documents: [...prev.documents, ...files]
    }))
  }

  const removeDocument = (index) => {
    setFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)
    // Handle form submission
  }

  return (
    <div className="offer">
      <div className="offer__header">
        <div className="offer__header-icon">
          <Building2 size={20} />
        </div>
        <h1 className="offer__title">List Your Property</h1>
      </div>

      <p className="offer__description">
        Tokenize your real estate property and offer it to investors on the blockchain.
      </p>

      <form className="offer__form" onSubmit={handleSubmit}>
        {/* Property Information Section */}
        <div className="offer__section">
          <h2 className="offer__section-title">Property Information</h2>
          
          <div className="offer__form-row">
            <div className="offer__form-group">
              <label>Property Name *</label>
              <input
                type="text"
                name="propertyName"
                placeholder="Enter property name"
                value={formData.propertyName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="offer__form-group">
              <label>Property Type *</label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                required
              >
                <option value="">Select property type</option>
                <option value="residential">Residential</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industrial</option>
                <option value="land">Land</option>
                <option value="mixed-use">Mixed Use</option>
              </select>
            </div>
          </div>

          <div className="offer__form-row">
            <div className="offer__form-group">
              <label>Location *</label>
              <input
                type="text"
                name="location"
                placeholder="City, Country"
                value={formData.location}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="offer__form-group">
              <label>Full Address *</label>
              <input
                type="text"
                name="address"
                placeholder="Street address"
                value={formData.address}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="offer__form-group">
            <label>Property Description *</label>
            <textarea
              name="description"
              placeholder="Provide detailed description of the property..."
              rows="6"
              value={formData.description}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Financial Details Section */}
        <div className="offer__section">
          <h2 className="offer__section-title">Financial Details</h2>
          
          <div className="offer__form-row">
            <div className="offer__form-group">
              <label>Property Value (USD) *</label>
              <input
                type="number"
                name="price"
                placeholder="0.00"
                value={formData.price}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="offer__form-group">
              <label>Total Token Supply *</label>
              <input
                type="number"
                name="tokenSupply"
                placeholder="Number of tokens"
                value={formData.tokenSupply}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="offer__form-row">
            <div className="offer__form-group">
              <label>Minimum Investment (USD) *</label>
              <input
                type="number"
                name="minimumInvestment"
                placeholder="0.00"
                value={formData.minimumInvestment}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="offer__form-group">
              <label>Expected Annual Return (%) *</label>
              <input
                type="number"
                name="expectedReturn"
                placeholder="0.00"
                step="0.01"
                value={formData.expectedReturn}
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="offer__form-group">
            <label>Project Duration *</label>
            <input
              type="text"
              name="projectDuration"
              placeholder="e.g., 12 months, 2 years"
              value={formData.projectDuration}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>

        {/* Property Features Section */}
        <div className="offer__section">
          <h2 className="offer__section-title">Property Features</h2>
          
          <div className="offer__features">
            {formData.features.map((feature, index) => (
              <div key={index} className="offer__feature-item">
                <input
                  type="text"
                  placeholder="Enter a feature (e.g., Swimming pool, 24/7 Security)"
                  value={feature}
                  onChange={(e) => handleFeatureChange(index, e.target.value)}
                />
                {formData.features.length > 1 && (
                  <button
                    type="button"
                    className="offer__feature-remove"
                    onClick={() => removeFeature(index)}
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            className="offer__add-feature"
            onClick={addFeature}
          >
            <Plus size={18} />
            Add Another Feature
          </button>
        </div>

        {/* Property Images Section */}
        <div className="offer__section">
          <h2 className="offer__section-title">Property Images</h2>
          
          <div className="offer__upload-area">
            <input
              type="file"
              id="images"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            <label htmlFor="images" className="offer__upload-label">
              <Upload size={32} />
              <p>Click to upload property images</p>
              <span>PNG, JPG, JPEG (Max 5MB each)</span>
            </label>
          </div>

          {previewImages.length > 0 && (
            <div className="offer__preview-grid">
              {previewImages.map((image, index) => (
                <div key={index} className="offer__preview-item">
                  <img src={image} alt={`Preview ${index + 1}`} />
                  <button
                    type="button"
                    className="offer__preview-remove"
                    onClick={() => removeImage(index)}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Documents Section */}
        <div className="offer__section">
          <h2 className="offer__section-title">Legal Documents</h2>
          
          <div className="offer__upload-area">
            <input
              type="file"
              id="documents"
              multiple
              accept=".pdf,.doc,.docx"
              onChange={handleDocumentUpload}
              style={{ display: 'none' }}
            />
            <label htmlFor="documents" className="offer__upload-label">
              <FileText size={32} />
              <p>Click to upload legal documents</p>
              <span>PDF, DOC, DOCX (Title deed, permits, etc.)</span>
            </label>
          </div>

          {formData.documents.length > 0 && (
            <div className="offer__document-list">
              {formData.documents.map((doc, index) => (
                <div key={index} className="offer__document-item">
                  <FileText size={20} />
                  <span>{doc.name}</span>
                  <button
                    type="button"
                    className="offer__document-remove"
                    onClick={() => removeDocument(index)}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Section */}
        <div className="offer__actions">
          <button type="button" className="offer__btn offer__btn--secondary">
            Save as Draft
          </button>
          <button type="submit" className="offer__btn offer__btn--primary">
            Submit for Review
          </button>
        </div>
      </form>
    </div>
  )
}

export default Offer
