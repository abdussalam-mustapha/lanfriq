import { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Upload, Shield, Copy, KeyRound, Mail } from 'lucide-react';
import { useCamp } from '../../context/CampContext';
import { Twitter, Music, Video } from 'lucide-react';
import './Settings.css';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [tiktokHandle, setTiktokHandle] = useState('');
  const [profileData, setProfileData] = useState({
    firstName: 'Baskey',
    lastName: 'Koer',
    email: 'baskeykoer@gmail.com',
    phone: '+234 903 382 1436',
    country: 'Nigeria',
    address: 'Eke/185, Adedus, Ile- Omagba, Ibedan, Oyo-State'
  });

  const [kinData, setKinData] = useState({
    firstName: 'Baskey',
    lastName: 'Koer',
    email: 'baskeykoer@gmail.com',
    phone: '+234 903 382 1436',
    country: 'Nigeria',
    address: 'Eke/185, Adedus, Ile- Omagba, Ibedan, Oyo-State'
  });

  const {
    isAuthenticated,
    linkedSocials,
    linkTwitter,
    linkSpotify,
    linkTikTok,
    unlinkTwitter,
    unlinkSpotify,
    unlinkTikTok,
    refreshLinkedSocials
  } = useCamp();

  useEffect(() => {
    if (isAuthenticated) {
      refreshLinkedSocials();
    }
  }, [isAuthenticated, activeTab]);

  const handleProfileChange = (field, value) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleKinChange = (field, value) => {
    setKinData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    console.log('Saving profile:', profileData);
  };

  const handleSaveKin = () => {
    console.log('Saving kin:', kinData);
  };

  const handleLinkTikTok = async () => {
    if (!tiktokHandle.trim()) {
      alert('Please enter your TikTok handle');
      return;
    }
    try {
      await linkTikTok(tiktokHandle);
      await refreshLinkedSocials();
      setTiktokHandle('');
      alert('TikTok linked successfully!');
    } catch (error) {
      alert(`Failed to link TikTok: ${error.message}`);
    }
  };

  const handleUnlinkSocial = async (social) => {
    const confirmUnlink = window.confirm(`Are you sure you want to unlink ${social}?`);
    if (!confirmUnlink) return;

    try {
      if (social === 'Twitter') await unlinkTwitter();
      else if (social === 'Spotify') await unlinkSpotify();
      else if (social === 'TikTok') await unlinkTikTok();
      
      await refreshLinkedSocials();
      alert(`${social} unlinked successfully!`);
    } catch (error) {
      alert(`Failed to unlink ${social}: ${error.message}`);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-page__header">
        <div className="settings-page__title-section">
          <div className="settings-page__icon">
            <SettingsIcon size={24} />
          </div>
          <h1>Settings / Profile</h1>
        </div>
      </div>

      <div className="settings-page__tabs">
        <button
          className={`settings-page__tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </button>
        <button
          className={`settings-page__tab ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          Security
        </button>
      </div>

      {activeTab === 'profile' && (
        <div className="settings-page__content">
          <section className="settings-section">
            <h2>Personal Profile</h2>
            
            <div className="settings-section__avatar">
              <div className="settings-section__avatar-img">
                <img src="/avatar-placeholder.jpg" alt="Profile" />
              </div>
              <button className="settings-section__upload-btn">
                Upload image
              </button>
            </div>

            <div className="settings-section__subtitle">
              Personal information
            </div>

            <div className="settings-section__form-row">
              <div className="settings-section__form-group">
                <label>First name</label>
                <input
                  type="text"
                  value={profileData.firstName}
                  onChange={(e) => handleProfileChange('firstName', e.target.value)}
                />
              </div>
              <div className="settings-section__form-group">
                <label>Last name</label>
                <input
                  type="text"
                  value={profileData.lastName}
                  onChange={(e) => handleProfileChange('lastName', e.target.value)}
                />
              </div>
            </div>

            <div className="settings-section__subtitle">
              Contact information
            </div>

            <div className="settings-section__form-group">
              <label>Email</label>
              <div className="settings-section__input-with-icon">
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleProfileChange('email', e.target.value)}
                />
                <button className="settings-section__copy-btn">
                  <Copy size={16} />
                </button>
              </div>
            </div>

            <div className="settings-section__form-group">
              <label>Phone number</label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleProfileChange('phone', e.target.value)}
              />
            </div>

            <div className="settings-section__form-row">
              <div className="settings-section__form-group">
                <label>Country</label>
                <select
                  value={profileData.country}
                  onChange={(e) => handleProfileChange('country', e.target.value)}
                >
                  <option value="Nigeria">Nigeria</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Kenya">Kenya</option>
                  <option value="South Africa">South Africa</option>
                </select>
              </div>
              <div className="settings-section__form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={profileData.address}
                  onChange={(e) => handleProfileChange('address', e.target.value)}
                />
              </div>
            </div>

            <div className="settings-section__actions">
              <div className="settings-section__date">
                Account Created: <strong>25 may, 2023 - 04:30PM GMT+1</strong>
              </div>
              <button className="settings-section__save-btn" onClick={handleSaveProfile}>
                Save changes
              </button>
            </div>
          </section>

          <section className="settings-section">
            <h2>Next of Kin profile</h2>

            <div className="settings-section__subtitle">
              Next of kin information
            </div>

            <div className="settings-section__form-row">
              <div className="settings-section__form-group">
                <label>First name</label>
                <input
                  type="text"
                  value={kinData.firstName}
                  onChange={(e) => handleKinChange('firstName', e.target.value)}
                />
              </div>
              <div className="settings-section__form-group">
                <label>Last name</label>
                <input
                  type="text"
                  value={kinData.lastName}
                  onChange={(e) => handleKinChange('lastName', e.target.value)}
                />
              </div>
            </div>

            <div className="settings-section__subtitle">
              Next of kin Contact information
            </div>

            <div className="settings-section__form-group">
              <label>Email</label>
              <input
                type="email"
                value={kinData.email}
                onChange={(e) => handleKinChange('email', e.target.value)}
              />
            </div>

            <div className="settings-section__form-group">
              <label>Phone number</label>
              <input
                type="tel"
                value={kinData.phone}
                onChange={(e) => handleKinChange('phone', e.target.value)}
              />
            </div>

            <div className="settings-section__form-row">
              <div className="settings-section__form-group">
                <label>Country</label>
                <select
                  value={kinData.country}
                  onChange={(e) => handleKinChange('country', e.target.value)}
                >
                  <option value="Nigeria">Nigeria</option>
                  <option value="Ghana">Ghana</option>
                  <option value="Kenya">Kenya</option>
                  <option value="South Africa">South Africa</option>
                </select>
              </div>
              <div className="settings-section__form-group">
                <label>Address</label>
                <input
                  type="text"
                  value={kinData.address}
                  onChange={(e) => handleKinChange('address', e.target.value)}
                />
              </div>
            </div>

            <div className="settings-section__actions" style={{ justifyContent: 'flex-end' }}>
              <button className="settings-section__save-btn" onClick={handleSaveKin}>
                Save changes
              </button>
            </div>
          </section>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="settings-page__content">
          <section className="settings-section">
            <h2>Security</h2>

            <div className="security-item">
              <div className="security-item__icon" style={{ background: 'rgba(140, 192, 67, 0.1)' }}>
                <KeyRound size={24} />
              </div>
              <div className="security-item__content">
                <h3>2-Step authentication</h3>
                <p>Enabling 2FA greatly protects your account in case you are unable to log in.</p>
              </div>
              <button className="security-item__btn security-item__btn--active">
                Active
              </button>
            </div>

            <div className="security-item">
              <div className="security-item__icon">
                <Mail size={24} />
              </div>
              <div className="security-item__content">
                <h3>Email verification</h3>
                <p>You will send a verification code while in sign in or when event...</p>
              </div>
              <button className="security-item__btn">
                Disable
              </button>
            </div>

            <h3 style={{ marginTop: '3rem', marginBottom: '1.5rem', fontSize: '1.125rem', color: 'var(--text-primary)' }}>
              Password management
            </h3>

            <div className="security-item">
              <div className="security-item__icon">
                <Shield size={24} />
              </div>
              <div className="security-item__content">
                <h3>Change password</h3>
                <p>Better change password to another password</p>
              </div>
              <button className="security-item__btn security-item__btn--change">
                Change
              </button>
            </div>

            <h3 style={{ marginTop: '3rem', marginBottom: '1.5rem', fontSize: '1.125rem', color: 'var(--text-primary)' }}>
              Social Accounts (Camp Network Origin)
            </h3>

            {!isAuthenticated && (
              <div className="social-connect-warning">
                <p>Connect your wallet to link social accounts for IPNFT minting</p>
              </div>
            )}

            <div className="security-item">
              <div className="security-item__icon" style={{ background: 'rgba(29, 161, 242, 0.1)', color: '#1DA1F2' }}>
                <Twitter size={24} />
              </div>
              <div className="security-item__content">
                <h3>Twitter / X</h3>
                <p>Link your Twitter account to mint social IPNFTs from your tweets</p>
              </div>
              {linkedSocials.twitter ? (
                <button 
                  className="security-item__btn security-item__btn--active"
                  onClick={() => handleUnlinkSocial('Twitter')}
                >
                  Linked
                </button>
              ) : (
                <button 
                  className="security-item__btn security-item__btn--change"
                  onClick={linkTwitter}
                  disabled={!isAuthenticated}
                >
                  Link
                </button>
              )}
            </div>

            <div className="security-item">
              <div className="security-item__icon" style={{ background: 'rgba(30, 215, 96, 0.1)', color: '#1DB954' }}>
                <Music size={24} />
              </div>
              <div className="security-item__content">
                <h3>Spotify</h3>
                <p>Link your Spotify account to mint IPNFTs from your music data</p>
              </div>
              {linkedSocials.spotify ? (
                <button 
                  className="security-item__btn security-item__btn--active"
                  onClick={() => handleUnlinkSocial('Spotify')}
                >
                  Linked
                </button>
              ) : (
                <button 
                  className="security-item__btn security-item__btn--change"
                  onClick={linkSpotify}
                  disabled={!isAuthenticated}
                >
                  Link
                </button>
              )}
            </div>

            <div className="security-item">
              <div className="security-item__icon" style={{ background: 'rgba(0, 0, 0, 0.1)' }}>
                <Video size={24} />
              </div>
              <div className="security-item__content">
                <h3>TikTok</h3>
                <p>Link your TikTok account to mint IPNFTs from your content</p>
                {!linkedSocials.tiktok && (
                  <input
                    type="text"
                    placeholder="Enter TikTok handle"
                    value={tiktokHandle}
                    onChange={(e) => setTiktokHandle(e.target.value)}
                    style={{
                      marginTop: '0.5rem',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      background: 'rgba(255, 255, 255, 0.03)',
                      color: 'var(--text-primary)',
                      fontSize: '0.875rem',
                      width: '100%',
                      maxWidth: '300px'
                    }}
                    disabled={!isAuthenticated}
                  />
                )}
              </div>
              {linkedSocials.tiktok ? (
                <button 
                  className="security-item__btn security-item__btn--active"
                  onClick={() => handleUnlinkSocial('TikTok')}
                >
                  Linked
                </button>
              ) : (
                <button 
                  className="security-item__btn security-item__btn--change"
                  onClick={handleLinkTikTok}
                  disabled={!isAuthenticated || !tiktokHandle.trim()}
                >
                  Link
                </button>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default Settings;
