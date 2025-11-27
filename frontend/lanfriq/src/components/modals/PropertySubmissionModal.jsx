import { useState } from 'react';
import { MapPin, Upload, X, User, ArrowRight, ArrowLeft } from 'lucide-react';

const PropertySubmissionModal = ({ isOpen, onClose, onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    assetName: '',
    assetType: '',
    description: '',
    location: '',
    assetSize: '',
    estimatedValue: '',
    assetImage: null,
    surveyPlan: [],
    titleDeed: [],
    taxClearance: [],
    landReceipt: [],
    propertyPhotos: [],
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    identificationType: '',
    idNumber: '',
    idUpload: null
  });

  const [teamMembers, setTeamMembers] = useState([]);

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, fieldName) => {
    const files = Array.from(e.target.files);
    if (fieldName === 'assetImage' || fieldName === 'idUpload') {
      setFormData(prev => ({ ...prev, [fieldName]: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [fieldName]: files }));
    }
  };

  const handleAddTeamMember = () => {
    const newMember = {
      name: formData.ownerName,
      email: formData.ownerEmail,
      phone: formData.ownerPhone,
      id: Date.now()
    };
    setTeamMembers(prev => [...prev, newMember]);
    setFormData(prev => ({
      ...prev,
      ownerName: '',
      ownerEmail: '',
      ownerPhone: ''
    }));
  };

  const handleRemoveTeamMember = (id) => {
    setTeamMembers(prev => prev.filter(member => member.id !== id));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(formData, teamMembers);
  };

  return (
    <div className="modal__backdrop" onClick={onClose}>
      <div className="modal__container" onClick={(e) => e.stopPropagation()}>
        <div className="modal__header">
          <h2>Submit Property for Tokenization</h2>
          <button className="modal__close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal__steps">
          <div className={`modal__step ${currentStep >= 1 ? 'active' : ''}`}>
            <span>1</span>
            <p>Asset Information</p>
          </div>
          <div className={`modal__step ${currentStep >= 2 ? 'active' : ''}`}>
            <span>2</span>
            <p>Verify Ownership</p>
          </div>
          <div className={`modal__step ${currentStep >= 3 ? 'active' : ''}`}>
            <span>3</span>
            <p>Team Management</p>
          </div>
        </div>

        <div className="modal__body">
          <div className="modal__left">
            <MapPin size={48} className="modal__icon" />
            <h3>Tokenize Your Real Estate</h3>
            <p>Transform your property into digital tokens and unlock new investment opportunities</p>
          </div>

          <div className="modal__right">
            {currentStep === 1 && (
              <div className="modal__form">
                <div className="modal__form-group">
                  <label>Asset Name</label>
                  <input
                    type="text"
                    name="assetName"
                    value={formData.assetName}
                    onChange={handleInputChange}
                    placeholder="Enter property name"
                  />
                </div>

                <div className="modal__form-row">
                  <div className="modal__form-group">
                    <label>Asset Type</label>
                    <select
                      name="assetType"
                      value={formData.assetType}
                      onChange={handleInputChange}
                    >
                      <option value="">Select type</option>
                      <option value="residential">Residential</option>
                      <option value="commercial">Commercial</option>
                      <option value="industrial">Industrial</option>
                      <option value="land">Land</option>
                    </select>
                  </div>

                  <div className="modal__form-group">
                    <label>Location</label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Property location"
                    />
                  </div>
                </div>

                <div className="modal__form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="Describe your property"
                  />
                </div>

                <div className="modal__form-row">
                  <div className="modal__form-group">
                    <label>Asset Size (sqm)</label>
                    <input
                      type="number"
                      name="assetSize"
                      value={formData.assetSize}
                      onChange={handleInputChange}
                      placeholder="0"
                    />
                  </div>

                  <div className="modal__form-group">
                    <label>Estimated Value ($)</label>
                    <input
                      type="number"
                      name="estimatedValue"
                      value={formData.estimatedValue}
                      onChange={handleInputChange}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="modal__form-group">
                  <label>Upload Image</label>
                  <div className="modal__upload">
                    <Upload size={24} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'assetImage')}
                    />
                    <span>{formData.assetImage ? formData.assetImage.name : 'Click to upload'}</span>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="modal__form">
                <p className="modal__form-note">
                  Upload the required documents to verify property ownership
                </p>

                <div className="modal__form-group">
                  <label>Survey Plan</label>
                  <div className="modal__upload">
                    <Upload size={24} />
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange(e, 'surveyPlan')}
                    />
                    <span>{formData.surveyPlan.length > 0 ? `${formData.surveyPlan.length} file(s) selected` : 'Upload files'}</span>
                  </div>
                </div>

                <div className="modal__form-group">
                  <label>Title Deed</label>
                  <div className="modal__upload">
                    <Upload size={24} />
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange(e, 'titleDeed')}
                    />
                    <span>{formData.titleDeed.length > 0 ? `${formData.titleDeed.length} file(s) selected` : 'Upload files'}</span>
                  </div>
                </div>

                <div className="modal__form-group">
                  <label>Tax Clearance</label>
                  <div className="modal__upload">
                    <Upload size={24} />
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange(e, 'taxClearance')}
                    />
                    <span>{formData.taxClearance.length > 0 ? `${formData.taxClearance.length} file(s) selected` : 'Upload files'}</span>
                  </div>
                </div>

                <div className="modal__form-group">
                  <label>Land Receipt</label>
                  <div className="modal__upload">
                    <Upload size={24} />
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange(e, 'landReceipt')}
                    />
                    <span>{formData.landReceipt.length > 0 ? `${formData.landReceipt.length} file(s) selected` : 'Upload files'}</span>
                  </div>
                </div>

                <div className="modal__form-group">
                  <label>Property Photos</label>
                  <div className="modal__upload">
                    <Upload size={24} />
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'propertyPhotos')}
                    />
                    <span>{formData.propertyPhotos.length > 0 ? `${formData.propertyPhotos.length} file(s) selected` : 'Upload photos'}</span>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="modal__form">
                <p className="modal__form-note">
                  Add co-owners or team members who will manage this property
                </p>

                <div className="modal__form-row">
                  <div className="modal__form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleInputChange}
                      placeholder="Enter name"
                    />
                  </div>

                  <div className="modal__form-group">
                    <label>Email Address</label>
                    <input
                      type="email"
                      name="ownerEmail"
                      value={formData.ownerEmail}
                      onChange={handleInputChange}
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                <div className="modal__form-row">
                  <div className="modal__form-group">
                    <label>Phone Number</label>
                    <input
                      type="tel"
                      name="ownerPhone"
                      value={formData.ownerPhone}
                      onChange={handleInputChange}
                      placeholder="+1 234 567 8900"
                    />
                  </div>

                  <div className="modal__form-group">
                    <label>ID Type</label>
                    <select
                      name="identificationType"
                      value={formData.identificationType}
                      onChange={handleInputChange}
                    >
                      <option value="">Select ID type</option>
                      <option value="passport">Passport</option>
                      <option value="drivers_license">Driver's License</option>
                      <option value="national_id">National ID</option>
                    </select>
                  </div>
                </div>

                <div className="modal__form-row">
                  <div className="modal__form-group">
                    <label>ID Number</label>
                    <input
                      type="text"
                      name="idNumber"
                      value={formData.idNumber}
                      onChange={handleInputChange}
                      placeholder="Enter ID number"
                    />
                  </div>

                  <div className="modal__form-group">
                    <label>Upload ID</label>
                    <div className="modal__upload">
                      <Upload size={20} />
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange(e, 'idUpload')}
                      />
                      <span>{formData.idUpload ? formData.idUpload.name : 'Upload'}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  className="modal__add-member"
                  onClick={handleAddTeamMember}
                >
                  <User size={18} />
                  Add Team Member
                </button>

                {teamMembers.length > 0 && (
                  <div className="modal__team-list">
                    <h4>Team Members ({teamMembers.length})</h4>
                    <table className="modal__team-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Phone</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {teamMembers.map(member => (
                          <tr key={member.id}>
                            <td>{member.name}</td>
                            <td>{member.email}</td>
                            <td>{member.phone}</td>
                            <td>
                              <button
                                className="modal__remove-btn"
                                onClick={() => handleRemoveTeamMember(member.id)}
                              >
                                <X size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="modal__footer">
          {currentStep > 1 && (
            <button className="modal__btn modal__btn--secondary" onClick={handleBack}>
              <ArrowLeft size={18} />
              Back
            </button>
          )}
          {currentStep < 3 ? (
            <button className="modal__btn modal__btn--primary" onClick={handleNext}>
              Save & Continue
              <ArrowRight size={18} />
            </button>
          ) : (
            <button className="modal__btn modal__btn--primary" onClick={handleSubmit}>
              Submit for Verification
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertySubmissionModal;
