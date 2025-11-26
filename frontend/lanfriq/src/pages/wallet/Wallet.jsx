import { useState } from 'react'
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, RefreshCw, Copy, TrendingUp, Calendar } from 'lucide-react'
import './Wallet.css'

const Wallet = () => {
  const [activeTab, setActiveTab] = useState('send')
  const [sendData, setSendData] = useState({
    walletAddress: '',
    network: '',
    currency: '',
    amount: ''
  })
  const [swapData, setSwapData] = useState({
    fromNetwork: 'NGN',
    fromAmount: '10,000.00',
    toNetwork: 'NGN',
    toAmount: '10,000.00',
    processingFee: '0.00'
  })
  const [depositAmount, setDepositAmount] = useState('')

  const transactions = [
    { type: 'buy', name: 'Beta Ukah #001', amount: '345.00 HBAR', status: 'success', icon: <TrendingUp size={16} /> },
    { type: 'sell', name: 'Stack Tokens #1340', amount: '899.00 HBAR', status: 'error', icon: <ArrowUpRight size={16} /> },
    { type: 'listed', name: 'Affif Fractions #009', amount: '430.90 HBAR', status: 'warning', icon: <Calendar size={16} /> },
    { type: 'buy', name: 'Supply Chain Core #1040', amount: '560.62 HBAR', status: 'success', icon: <TrendingUp size={16} /> },
    { type: 'sell', name: 'Digi Studs #1990', amount: '320.90 HBAR', status: 'error', icon: <ArrowUpRight size={16} /> }
  ]

  const renderSendTab = () => (
    <div className="wallet__tab-content">
      <div className="wallet__form">
        <div className="wallet__form-group">
          <label>Wallet Address</label>
          <input
            type="text"
            placeholder="Enter your wallet address"
            value={sendData.walletAddress}
            onChange={(e) => setSendData({...sendData, walletAddress: e.target.value})}
          />
        </div>

        <div className="wallet__form-group">
          <label>Choose network</label>
          <input
            type="text"
            placeholder="Enter your wallet address"
            value={sendData.network}
            onChange={(e) => setSendData({...sendData, network: e.target.value})}
          />
        </div>

        <div className="wallet__form-group">
          <label>Choose currency</label>
          <input
            type="text"
            placeholder="Enter your wallet address"
            value={sendData.currency}
            onChange={(e) => setSendData({...sendData, currency: e.target.value})}
          />
        </div>

        <div className="wallet__form-group">
          <label>Amount</label>
          <input
            type="text"
            placeholder="0.00"
            value={sendData.amount}
            onChange={(e) => setSendData({...sendData, amount: e.target.value})}
          />
          <div className="wallet__form-footer">
            <span>Tokhat ~</span>
            <span>$1,489.00</span>
          </div>
        </div>

        <button className="wallet__submit-btn">Send Now</button>
      </div>
    </div>
  )

  const renderSwapTab = () => (
    <div className="wallet__tab-content">
      <div className="wallet__form">
        <div className="wallet__swap-section">
          <label>From</label>
          <div className="wallet__swap-input">
            <div className="wallet__swap-network">
              <div className="wallet__network-dot"></div>
              <select value={swapData.fromNetwork} onChange={(e) => setSwapData({...swapData, fromNetwork: e.target.value})}>
                <option value="NGN">NGN</option>
                <option value="USD">USD</option>
                <option value="ETH">ETH</option>
              </select>
            </div>
            <div className="wallet__swap-divider"></div>
            <div className="wallet__swap-right">
              <input type="text" placeholder="Amount" value={swapData.fromAmount} onChange={(e) => setSwapData({...swapData, fromAmount: e.target.value})} />
              <span className="wallet__swap-amount">10,000.00</span>
            </div>
          </div>
        </div>

        <button className="wallet__swap-toggle">
          <RefreshCw size={20} />
        </button>

        <div className="wallet__swap-section">
          <label>To</label>
          <div className="wallet__swap-input">
            <div className="wallet__swap-network">
              <div className="wallet__network-dot"></div>
              <select value={swapData.toNetwork} onChange={(e) => setSwapData({...swapData, toNetwork: e.target.value})}>
                <option value="NGN">NGN</option>
                <option value="USD">USD</option>
                <option value="ETH">ETH</option>
              </select>
            </div>
            <div className="wallet__swap-divider"></div>
            <div className="wallet__swap-right">
              <input type="text" placeholder="Amount" value={swapData.toAmount} onChange={(e) => setSwapData({...swapData, toAmount: e.target.value})} />
              <span className="wallet__swap-amount">10,000.00</span>
            </div>
          </div>
        </div>

        <div className="wallet__form-footer">
          <span>Processing fee</span>
          <span>{swapData.processingFee}</span>
        </div>

        <button className="wallet__submit-btn">Convert</button>
      </div>
    </div>
  )

  const renderReceiveTab = () => (
    <div className="wallet__tab-content">
      <div className="wallet__form">
        <div className="wallet__form-group">
          <label>Amount</label>
          <input
            type="text"
            placeholder="Enter amount"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
          />
        </div>

        <button className="wallet__submit-btn">Deposit fund</button>
      </div>
    </div>
  )

  return (
    <div className="wallet">
      <div className="wallet__header">
        <div className="wallet__header-icon">
          <WalletIcon size={20} />
        </div>
        <h1 className="wallet__title">Wallet</h1>
      </div>

      <p className="wallet__description">
        Discover verified real estate opportunities across Africa with blockchain-backed trust.
      </p>

      <div className="wallet__content">
        <div className="wallet__left">
          {/* Stats Cards */}
          <div className="wallet__stats">
            <div className="wallet__stat-card">
              <div className="wallet__stat-value">$2,004.90</div>
              <div className="wallet__stat-label">Total Assets</div>
              <Copy size={16} className="wallet__stat-icon" />
            </div>
            <div className="wallet__stat-card">
              <div className="wallet__stat-value">$2,004.90</div>
              <div className="wallet__stat-label">Total Deposits</div>
              <TrendingUp size={16} className="wallet__stat-icon" />
            </div>
            <div className="wallet__stat-card">
              <div className="wallet__stat-value">+16.3%</div>
              <div className="wallet__stat-label">APY</div>
              <div className="wallet__stat-icon">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect width="16" height="16" rx="2" fill="currentColor" opacity="0.2"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="wallet__chart-section">
            <div className="wallet__chart-header">
              <div className="wallet__chart-tabs">
                <button className="wallet__chart-tab wallet__chart-tab--active">Total income</button>
                <button className="wallet__chart-tab">Total expenditure</button>
              </div>
              <div className="wallet__chart-period">
                <Calendar size={16} />
                <span>Jun 01 - June 15</span>
              </div>
            </div>

            <div className="wallet__chart-amount">$10,124,100.55</div>

            <div className="wallet__chart">
              <div className="wallet__chart-y-axis">
                <span>50M</span>
                <span>40M</span>
                <span>30M</span>
                <span>20M</span>
                <span>1M</span>
                <span>0</span>
              </div>
              <div className="wallet__chart-content">
                <svg viewBox="0 0 500 200" className="wallet__chart-svg" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="walletChartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#8cc043" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#8cc043" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path 
                    d="M 0,120 L 50,100 L 100,110 L 150,90 L 200,95 L 250,70 L 300,80 L 350,60 L 400,70 L 450,50 L 500,55"
                    fill="none"
                    stroke="#8cc043"
                    strokeWidth="2.5"
                  />
                  <path 
                    d="M 0,120 L 50,100 L 100,110 L 150,90 L 200,95 L 250,70 L 300,80 L 350,60 L 400,70 L 450,50 L 500,55 L 500,200 L 0,200 Z"
                    fill="url(#walletChartGradient)"
                  />
                </svg>
                <div className="wallet__chart-x-axis">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span className="wallet__chart-month--active">Jun</span>
                  <span>Jul</span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="wallet__transactions">
            <div className="wallet__transactions-header">
              <h3>Recent Transactions</h3>
              <button className="wallet__transactions-search">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M11 11L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Search
              </button>
            </div>

            <div className="wallet__transactions-list">
              {transactions.map((tx, index) => (
                <div key={index} className={`wallet__transaction wallet__transaction--${tx.status}`}>
                  <div className={`wallet__transaction-icon wallet__transaction-icon--${tx.status}`}>
                    {tx.icon}
                  </div>
                  <div className="wallet__transaction-info">
                    <p className="wallet__transaction-type">{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</p>
                    <p className="wallet__transaction-name">{tx.name}</p>
                  </div>
                  <div className="wallet__transaction-amount">{tx.amount}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="wallet__right">
          <div className="wallet__balance-card">
            <div className="wallet__balance-icon">
              <WalletIcon size={40} />
            </div>
            <p className="wallet__balance-label">Your total balance</p>
            <h2 className="wallet__balance-amount">$13,124,100.55</h2>
            <div className="wallet__balance-change">
              <span className="wallet__balance-token">1000.01 ETH</span>
              <span className="wallet__balance-percentage">+2.0%</span>
            </div>
          </div>

          <div className="wallet__tabs">
            <button 
              className={`wallet__tab ${activeTab === 'send' ? 'wallet__tab--active' : ''}`}
              onClick={() => setActiveTab('send')}
            >
              Send
            </button>
            <button 
              className={`wallet__tab ${activeTab === 'swap' ? 'wallet__tab--active' : ''}`}
              onClick={() => setActiveTab('swap')}
            >
              Swap
            </button>
            <button 
              className={`wallet__tab ${activeTab === 'receive' ? 'wallet__tab--active' : ''}`}
              onClick={() => setActiveTab('receive')}
            >
              Receive
            </button>
          </div>

          {activeTab === 'send' && renderSendTab()}
          {activeTab === 'swap' && renderSwapTab()}
          {activeTab === 'receive' && renderReceiveTab()}
        </div>
      </div>
    </div>
  )
}

export default Wallet
