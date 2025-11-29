# Lanfriq - Real Estate Tokenization Platform

## Project Overview

Lanfriq is a comprehensive blockchain-based platform that revolutionizes real estate investment by enabling property owners to tokenize their assets using **Camp Network's Origin SDK** for intellectual property rights and custom smart contracts for fractional ownership. Investors can purchase property shares through a secure, transparent marketplace with full on-chain verification.

### Why Lanfriq?

Real estate in Africa faces critical challenges that hinder economic growth and property ownership:

- **Land Disputes**: Over 90% of land in Africa is undocumented, leading to frequent ownership conflicts and legal battles
- **Lack of Transparency**: Opaque land registries and manual record-keeping systems create opportunities for fraud and corruption
- **Limited Access to Capital**: Traditional real estate investment requires significant capital, excluding millions from wealth-building opportunities
- **Inefficient Verification**: Property verification processes are slow, expensive, and often unreliable
- **Fraud and Title Issues**: Fake land documents and disputed titles cost investors billions annually

Lanfriq addresses these challenges by providing:
- **Immutable Ownership Records**: Blockchain-based property registration that cannot be altered or disputed
- **Transparent Transactions**: All property transfers and ownership changes recorded on-chain
- **Fractional Investment**: Lower barriers to entry through tokenized property shares
- **Automated Verification**: Smart contract-based KYB/KYC and property validation
- **Secure Trading**: P2P marketplace with built-in escrow and dispute resolution

### Key Features
- **Property Tokenization**: Dual-layer NFT system (IPNFT + PropertyNFT)
- **Camp Network Integration**: IP rights management via Origin SDK
- **Fractional Ownership**: Buy and sell property shares on-chain
- **Marketplace**: P2P trading with built-in royalty system
- **Multi-Chain Ready**: Currently on Camp Network Testnet
- **Verification System**: KYB/KYC integration for compliance

---



### Technology Stack

#### Frontend
- **Framework**: React 19.2.0 + Vite 7.2.4
- **Web3 Stack**: 
  - `@campnetwork/origin` ^1.2.4 - Camp Network Origin SDK
  - `wagmi` ^2.19.5 - React hooks for Ethereum
  - `viem` ^2.40.3 - TypeScript interface for Ethereum
  - `@rainbow-me/rainbowkit` ^2.2.9 - Wallet connection UI
  - `ethers` ^6.15.0 - Ethereum library
- **Styling**: CSS Modules with CSS Variables
- **Routing**: React Router DOM v7.9.6
- **State Management**: React Context API
- **Animations**: Framer Motion, AOS
- **Icons**: Lucide React, Tabler Icons

#### Smart Contracts (Deployed)
- **Solidity**: ^0.8.20
- **Development**: Hardhat ^2.22.0
- **Security**: OpenZeppelin Contracts 5.0.0
- **Network**: Camp Network Testnet (Basecamp)
  - Chain ID: `123420001114`
  - RPC: `https://rpc.basecamp.t.raas.gelato.cloud`

#### Contract Addresses (Camp Testnet)
```
PropertyNFT:         0x52719D5DA42707ec9ddD50A12A8Ec19bA3d1CF73
PropertyMarketplace: 0xBd84e89001247CeDa92fb7763f67192cDd5dA185
```


---


### How Lanfriq Uses Camp Network

#### 1. **IPNFT Minting** (IP Rights Layer)

Every property tokenized on Lanfriq creates an **IPNFT** (Intellectual Property NFT) using Camp Network's Origin SDK:


**IPNFT Features:**
- Programmable licensing terms
- Revenue sharing (royalties)
- Time-based access control
- Derivative works support
- Immutable IP rights on-chain

#### 2. **Authentication with Camp Modal**

Users authenticate via `campModal` for seamless wallet connection:

```javascript
// From: src/context/CampContext.jsx
await campModal.connect();  // Opens Camp authentication UI
const auth = campModal.auth;
const origin = campModal.origin;
```

**Authentication Features:**
- Wallet connection via RainbowKit + Camp Modal
- Social account linking (Twitter, Spotify, TikTok)
- Single sign-on across Camp Network dApps
- Built-in UI for better UX

#### 3. **Social Account Linking**

Properties can be linked to social proof:


#### 4. **Access Control & Revenue**

IPNFTs enable access-based monetization:


#### 5. **Camp Network Configuration**

```javascript
// From: src/config/wagmi.js
import { defineChain } from 'viem';

export const campTestnet = defineChain({
  id: 123420001114,
  name: 'Basecamp Testnet',
  nativeCurrency: { name: 'CAMP', symbol: 'CAMP', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://rpc.basecamp.t.raas.gelato.cloud'] }
  },
  blockExplorers: {
    default: { 
      name: 'Camp Explorer',
      url: 'https://explorer.basecamp.t.raas.gelato.cloud'
    }
  }
});
```


## Property Tokenization Flow

### Complete User Journey

```
1. Property Submission
   └─> PropertySubmissionModal
       ├─> Upload property images
       ├─> Enter details (address, type, valuation)
       ├─> Add team members
       └─> Submit for verification

2. Verification Fee Payment
   └─> VerificationFeeModal
       ├─> Pay 0.5 CAMP verification fee
       ├─> KYB/KYC process initiated
       └─> Property reviewed by admins

3. SPV Setup (Optional)
   └─> SPVSetupModal
       ├─> Choose legal structure
       ├─> Configure ownership
       └─> Set up Special Purpose Vehicle

4. Token Configuration
   └─> TokenSetupScreen
       ├─> Set token name & symbol
       ├─> Define total supply
       ├─> Set price per token
       ├─> Configure license terms
       └─> MINT PROPERTY

5. Dual NFT Minting
   ├─> Step 1: Mint IPNFT (Camp Network Origin)
   │   ├─> Upload property data to IPFS
   │   ├─> Create licensing terms
   │   ├─> Mint IPNFT token
   │   └─> Receive IPNFT Token ID
   │
   └─> Step 2: Mint PropertyNFT (Custom Contract)
       ├─> Create ERC721 token
       ├─> Link to IPNFT via URI
       ├─> Set shares & valuation
       ├─> Store property metadata
       └─> Receive PropertyNFT Token ID

6. Marketplace Listing
   └─> CreateListingModal
       ├─> Set price per share
       ├─> Choose shares to list
       ├─> Create marketplace listing
       └─> Property available for trading
```

// Dual minting process
const handlePublish = async (tokenData) => {
  setMintingProgress(0);
  
  // Step 1: Mint IPNFT (30-70% progress)
  const ipnftTokenId = await mintPropertyIPNFT(
    origin,
    propertyFile,
    metadata,
    licenseTerms
  );
  
  setMintingProgress(70);
  
  // Step 2: Mint PropertyNFT (70-100% progress)
  const { tokenId: propertyNFTId } = await mintPropertyNFT(signer, {
    to: address,
    address: propertyData.location,
    valuation: ethers.parseEther(valuation),
    totalShares: parseInt(tokenSupply),
    pricePerShare: ethers.parseEther(tokenPrice),
    uri: `ipfs://ipnft/${ipnftTokenId}` // Cross-reference
  });
  
  setMintingProgress(100);
  // Returns both: ipnftTokenId + propertyNFTId
};
```



## Getting Started

### Prerequisites

```bash
# Required
Node.js >= 18.x
npm >= 9.x (or yarn/pnpm)

# Optional (for smart contract development)
Hardhat ^2.22.0
```

### Installation

#### 1. Clone the Repository
```bash
git clone <repository-url>
cd lanfriq
```

#### 2. Install Frontend Dependencies
```bash
cd frontend/lanfriq
npm install
```

#### 3. Install Contract Dependencies
```bash
cd ../../contracts
npm install
```

#### 4. Configure Environment Variables

**Frontend (.env)**
```env
# Camp Network Configuration
VITE_CAMP_CLIENT_ID=fce77d7a-8085-47ca-adff-306a933e76aa
VITE_CAMP_API_KEY=4f1a2c9c-008e-4a2e-8712-055fa04f9ffa
VITE_CAMP_ENVIRONMENT=DEVELOPMENT

# Smart Contract Addresses (Camp Testnet)
VITE_PROPERTY_NFT_ADDRESS=0x52719D5DA42707ec9ddD50A12A8Ec19bA3d1CF73
VITE_MARKETPLACE_ADDRESS=0xBd84e89001247CeDa92fb7763f67192cDd5dA185

# Network Configuration
VITE_CHAIN_ID=123420001114
VITE_RPC_URL=https://rpc.basecamp.t.raas.gelato.cloud

# WalletConnect Project ID (for RainbowKit)
VITE_WALLETCONNECT_PROJECT_ID=<your-project-id>
```

**Contracts (.env)**
```env
# Deployer Private Key (NEVER commit this!)
PRIVATE_KEY=<your-private-key>

# Camp Network Testnet RPC
CAMP_TESTNET_RPC=https://rpc.basecamp.t.raas.gelato.cloud
```

#### 5. Run Development Server
```bash
cd frontend/lanfriq
npm run dev
# Frontend: http://localhost:5173
```

### Quick Start Guide

1. **Get Test CAMP Tokens**
   - Visit Camp Network Testnet Faucet
   - Connect your wallet
   - Request test CAMP tokens

2. **Connect Wallet**
   - Click "Connect Wallet" in header
   - Select wallet provider
   - Approve connection

3. **Link Social Accounts** (Optional)
   - Go to Settings → Social Links
   - Connect Twitter, Spotify, or TikTok
   - Enhance your profile credibility

4. **Tokenize Your First Property**
   - Navigate to "Tokenization Hub"
   - Submit property details
   - Pay 0.5 CAMP verification fee
   - Configure token settings
   - Mint property (creates IPNFT + PropertyNFT)

5. **List on Marketplace**
   - Go to NFT page
   - Find your minted property
   - Click "List for Sale"
   - Set price per share
   - Create listing

---

## Smart Contract Development

### Compile Contracts
```bash
cd contracts
npm install
npx hardhat compile
```

### Run Tests
```bash
npx hardhat test
# Currently: 23/34 tests passing
```

### Deploy to Camp Testnet

1. **Add Private Key to .env**
```bash
echo "PRIVATE_KEY=your_private_key_here" > .env
```

2. **Get Test CAMP**
- Visit Camp Network Faucet
- Fund deployer address

3. **Deploy**
```bash
npx hardhat run scripts/deploy.js --network campTestnet
```

4. **Verify Deployment**
- Check `deployments/campTestnet.json` for addresses
- Update frontend `.env` with new addresses
- Copy ABIs to `frontend/lanfriq/src/contracts/`

### Deployment Output
```json
{
  "network": "campTestnet",
  "chainId": 123420001114,
  "deployer": "0xd9217C46e6b6e3c4bd1c4c5f1d0ECEf1052f24ce",
  "contracts": {
    "PropertyNFT": "0x52719D5DA42707ec9ddD50A12A8Ec19bA3d1CF73",
    "PropertyMarketplace": "0xBd84e89001247CeDa92fb7763f67192cDd5dA185"
  },
  "gasUsed": {
    "PropertyNFT": "~0.05 CAMP",
    "PropertyMarketplace": "~0.05 CAMP"
  }
}
```

---

## API Reference

### Contract Utilities (`src/utils/contractUtils.js`)

#### PropertyNFT Functions

```javascript
// Mint a new property NFT
await mintPropertyNFT(signer, {
  to: "0x...",
  address: "123 Main St",
  valuation: ethers.parseEther("500000"),
  totalShares: 1000,
  pricePerShare: ethers.parseEther("500"),
  uri: "ipfs://ipnft/123"
});

// Get property details
const property = await getPropertyDetails(provider, tokenId);
// Returns: { owner, propertyAddress, valuation, totalShares, ... }

// Transfer shares
await transferPropertyShares(signer, tokenId, toAddress, shares);

// Update property valuation
await updatePropertyValuation(signer, tokenId, newValuation);
```


3. **Environment Variables**
- Add all `VITE_*` variables in Vercel dashboard
- Never expose private keys in frontend

### Contract Deployment (Mainnet)

**Before mainnet deployment:**
- Complete security audit
- Test thoroughly on testnet
- Have emergency pause mechanisms
- Set up multi-sig for admin functions

```bash
# Deploy to Camp Network Mainnet
npx hardhat run scripts/deploy.js --network campMainnet

# Verify contracts
npx hardhat verify --network campMainnet <CONTRACT_ADDRESS>
```

---

## Architecture Decisions

### Why Dual NFT System?

**IPNFT (Camp Network Origin):**
- IP rights and licensing
- Revenue sharing (royalties)
- Access control
- Derivative works
- Not optimized for fractional ownership

**PropertyNFT (Custom Contract):**
- Fractional ownership (shares)
- Transfer management
- Valuation tracking
- Flexible marketplace integration
- No built-in IP licensing

**Combined Benefits:**
- IP rights + fractional ownership
- Licensing revenue + share trading
- Social proof + on-chain verification
- Flexibility + security



          

#

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Support & Contact

- **Discord**: [Join Community](https://discord.gg/lanfriq)
- **Twitter**: [@LanfriqHQ](https://twitter.com/lanfriqhq)
- **Email**: support@lanfriq.com
- **Documentation**: [docs.lanfriq.com](https://docs.lanfriq.com)

---

## Acknowledgments

- **Camp Network** - IP infrastructure and Origin SDK
- **OpenZeppelin** - Secure smart contract libraries
- **Hardhat** - Development environment
- **RainbowKit** - Wallet connection UI

---

**Built by the Lanfriq Team**

*Democratizing real estate investment through blockchain technology.*
