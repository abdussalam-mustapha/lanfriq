import { useState } from 'react';
import { X, FileText, Building2, FolderOpen, Users, BarChart3, Share2, DollarSign, Settings, Upload } from 'lucide-react';

const TokenSetupScreen = ({ isOpen, onClose, onPublish, assetImage }) => {
  const [tokenSetupSection, setTokenSetupSection] = useState('details');
  const [tokenData, setTokenData] = useState({
    saleType: 'public',
    totalSupply: '',
    tokenPrice: '',
    minBuy: '',
    maxBuy: '',
    addMethod: 'manual',
    walletAddresses: [{ wallet: '', email: '' }],
    csvFile: null,
    ownerAllocation: '20',
    investorsAllocation: '80',
    vestingPeriod: '12',
    cliff: '3'
  });

  if (!isOpen) return null;

  const handleTokenDataChange = (field, value) => {
    setTokenData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddWallet = () => {
    setTokenData(prev => ({
      ...prev,
      walletAddresses: [...prev.walletAddresses, { wallet: '', email: '' }]
    }));
  };

  const handleWalletChange = (index, field, value) => {
    const updatedWallets = [...tokenData.walletAddresses];
    updatedWallets[index][field] = value;
    setTokenData(prev => ({ ...prev, walletAddresses: updatedWallets }));
  };

  const handleCSVUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setTokenData(prev => ({ ...prev, csvFile: file }));
    }
  };

  const handlePublishClick = () => {
    onPublish(tokenData);
  };

  const navItems = [
    { id: 'details', label: 'Details', icon: FileText },
    { id: 'spv', label: 'SPV details', icon: Building2 },
    { id: 'documents', label: 'Asset Documents', icon: FolderOpen },
    { id: 'teams', label: 'Teams', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'socials', label: 'Socials', icon: Share2 },
    { id: 'earnings', label: 'Earnings', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <div className="modal__backdrop" onClick={onClose}>
      <div className="token-setup" onClick={(e) => e.stopPropagation()}>
        <div className="token-setup__sidebar">
          <div className="token-setup__header">
            <h3>Token Setup</h3>
          </div>

          <div className="token-setup__collection">
            <img src={assetImage || '/placeholder-property.jpg'} alt="Property" />
            <div>
              <h4>Hillside Token</h4>
              <p>HED - HBAR201</p>
            </div>
          </div>

          <div className="token-setup__nav">
            {navItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  className={tokenSetupSection === item.id ? 'active' : ''}
                  onClick={() => setTokenSetupSection(item.id)}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </div>

          <button className="token-setup__publish" onClick={handlePublishClick}>
            Publish
          </button>
        </div>

        <div className="token-setup__content">
          <button className="modal__close" onClick={onClose} style={{ position: 'absolute', top: '2rem', right: '2rem' }}>
            <X size={24} />
          </button>

        {tokenSetupSection === 'details' && (
          <div className="token-setup__section">
            <h2>Supply & Pricing</h2>

            <div className="token-setup__toggle">
              <button
                className={tokenData.saleType === 'public' ? 'active' : ''}
                onClick={() => handleTokenDataChange('saleType', 'public')}
              >
                Public sales
              </button>
              <button
                className={tokenData.saleType === 'whitelist' ? 'active' : ''}
                onClick={() => handleTokenDataChange('saleType', 'whitelist')}
              >
                Whitelist only
              </button>
            </div>

            <div className="token-setup__valuation">
              <span>Property Valuation</span>
              <strong>$85,000,000</strong>
            </div>

            <div className="token-setup__form-row">
              <div className="token-setup__form-group">
                <label>Total Supply</label>
                <input
                  type="number"
                  value={tokenData.totalSupply}
                  onChange={(e) => handleTokenDataChange('totalSupply', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="token-setup__form-group">
                <label>Token Price ($)</label>
                <input
                  type="number"
                  value={tokenData.tokenPrice}
                  onChange={(e) => handleTokenDataChange('tokenPrice', e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="token-setup__form-row">
              <div className="token-setup__form-group">
                <label>Minimum buy</label>
                <input
                  type="number"
                  value={tokenData.minBuy}
                  onChange={(e) => handleTokenDataChange('minBuy', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="token-setup__form-group">
                <label>Maximum buy</label>
                <input
                  type="number"
                  value={tokenData.maxBuy}
                  onChange={(e) => handleTokenDataChange('maxBuy', e.target.value)}
                  placeholder="0"
                />
              </div>
            </div>

            {tokenData.saleType === 'whitelist' && (
              <>
                <div className="token-setup__add-method">
                  <label>
                    <input
                      type="radio"
                      name="addMethod"
                      checked={tokenData.addMethod === 'manual'}
                      onChange={() => handleTokenDataChange('addMethod', 'manual')}
                    />
                    Add manually
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="addMethod"
                      checked={tokenData.addMethod === 'import'}
                      onChange={() => handleTokenDataChange('addMethod', 'import')}
                    />
                    Import address
                  </label>
                </div>

                {tokenData.addMethod === 'manual' && (
                  <>
                    {tokenData.walletAddresses.map((wallet, index) => (
                      <div key={index} className="token-setup__form-row">
                        <div className="token-setup__form-group">
                          <label>Wallet Address</label>
                          <input
                            type="text"
                            value={wallet.wallet}
                            onChange={(e) => handleWalletChange(index, 'wallet', e.target.value)}
                            placeholder="0x..."
                          />
                        </div>
                        <div className="token-setup__form-group">
                          <label>Email Address</label>
                          <input
                            type="email"
                            value={wallet.email}
                            onChange={(e) => handleWalletChange(index, 'email', e.target.value)}
                            placeholder="email@example.com"
                          />
                        </div>
                      </div>
                    ))}
                    <button className="token-setup__add-more" onClick={handleAddWallet}>
                      + Add more wallet
                    </button>
                  </>
                )}

                {tokenData.addMethod === 'import' && (
                  <div className="token-setup__csv-upload">
                    {!tokenData.csvFile ? (
                      <label className="token-setup__csv-label">
                        <Upload size={32} />
                        <span>Click to upload CSV file</span>
                        <input
                          type="file"
                          accept=".csv"
                          onChange={handleCSVUpload}
                          style={{ display: 'none' }}
                        />
                      </label>
                    ) : (
                      <div className="token-setup__csv-file">
                        <span>{tokenData.csvFile.name}</span>
                        <button onClick={() => handleTokenDataChange('csvFile', null)}>
                          Change
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {tokenSetupSection === 'socials' && (
          <div className="token-setup__section">
            <h2>Distribution Model</h2>

            <div className="token-setup__valuation">
              <span>Property Valuation</span>
              <strong>$85,000,000</strong>
            </div>

            <div className="token-setup__form-row">
              <div className="token-setup__form-group">
                <label>Owner Allocation</label>
                <div className="token-setup__input-suffix">
                  <input
                    type="number"
                    value={tokenData.ownerAllocation}
                    onChange={(e) => handleTokenDataChange('ownerAllocation', e.target.value)}
                    placeholder="0"
                  />
                  <span>%</span>
                </div>
              </div>
              <div className="token-setup__form-group">
                <label>Investors Allocation</label>
                <div className="token-setup__input-suffix">
                  <input
                    type="number"
                    value={tokenData.investorsAllocation}
                    onChange={(e) => handleTokenDataChange('investorsAllocation', e.target.value)}
                    placeholder="0"
                  />
                  <span>%</span>
                </div>
              </div>
            </div>

            <div className="token-setup__form-row">
              <div className="token-setup__form-group">
                <label>Vesting Period</label>
                <div className="token-setup__input-suffix">
                  <input
                    type="number"
                    value={tokenData.vestingPeriod}
                    onChange={(e) => handleTokenDataChange('vestingPeriod', e.target.value)}
                    placeholder="0"
                  />
                  <span>weeks</span>
                </div>
              </div>
              <div className="token-setup__form-group">
                <label>Cliff</label>
                <div className="token-setup__input-suffix">
                  <input
                    type="number"
                    value={tokenData.cliff}
                    onChange={(e) => handleTokenDataChange('cliff', e.target.value)}
                    placeholder="0"
                  />
                  <span>weeks</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {tokenSetupSection === 'spv' && (
          <div className="token-setup__section">
            <h2>SPV Details</h2>
            <p>Manage your Special Purpose Vehicle information and documentation.</p>
          </div>
        )}

        {tokenSetupSection === 'documents' && (
          <div className="token-setup__section">
            <h2>Asset Documents</h2>
            <p>Upload and manage all property-related documents.</p>
          </div>
        )}

        {tokenSetupSection === 'teams' && (
          <div className="token-setup__section">
            <h2>Teams</h2>
            <p>Manage team members and their roles in the tokenization process.</p>
          </div>
        )}

        {tokenSetupSection === 'reports' && (
          <div className="token-setup__section">
            <h2>Reports</h2>
            <p>View and download property performance and financial reports.</p>
          </div>
        )}

        {tokenSetupSection === 'earnings' && (
          <div className="token-setup__section">
            <h2>Earnings</h2>
            <p>Track rental income and dividend distributions.</p>
          </div>
        )}

        {tokenSetupSection === 'settings' && (
          <div className="token-setup__section">
            <h2>Settings</h2>
            <p>Configure token settings and preferences.</p>
          </div>
        )}
      </div>
    </div>
    </div>
  );
};

export default TokenSetupScreen;
