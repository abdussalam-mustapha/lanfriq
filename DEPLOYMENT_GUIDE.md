# 🚀 Deployment Guide

## Status Report (November 28, 2025)

### ❌ Smart Contracts: NOT DEPLOYED
The contracts are compiled and ready but **have not been deployed to Camp Network yet**.

### ✅ Fixed: Camp Network Origin SDK Implementation
Updated to use **`campModal`** instead of direct `Auth` class instantiation.

---

## 📝 Pre-Deployment Checklist

### 1. Get a Camp Network Testnet Wallet
- Create or import a wallet in MetaMask
- Get testnet CAMP tokens from faucet (if available)
- Save your private key securely

### 2. Configure Environment Variables

**Contracts** (`/contracts/.env`):
```bash
PRIVATE_KEY=your_private_key_here_without_0x_prefix
CAMP_API_KEY=4f1a2c9c-008e-4a2e-8712-055fa04f9ffa
CAMP_TESTNET_RPC=https://rpc.basecamp.t.raas.gelato.cloud
CAMP_MAINNET_RPC=https://rpc-campnetwork.xyz
CAMP_ENVIRONMENT=development
```

**Frontend** (`/frontend/lanfriq/.env`):
```bash
VITE_CAMP_CLIENT_ID=fce77d7a-8085-47ca-adff-306a933e76aa
VITE_CAMP_API_KEY=4f1a2c9c-008e-4a2e-8712-055fa04f9ffa
VITE_CAMP_ENVIRONMENT=DEVELOPMENT
VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here

# These will be added after deployment:
# VITE_PROPERTY_NFT_ADDRESS=
# VITE_MARKETPLACE_ADDRESS=
```

---

## 🚀 Deployment Steps

### Step 1: Deploy Smart Contracts

```bash
cd /home/maverick/Desktop/lanfriq/contracts

# Install dependencies (if not done)
npm install

# Compile contracts
npm run compile

# Run tests to verify
npm test

# Deploy to Camp Testnet
npx hardhat run scripts/deploy.js --network campTestnet
```

**Expected Output:**
```
Deploying Lanfriq contracts to Camp Network...
Deploying contracts with account: 0x...
Account balance: ...

1. Deploying PropertyNFT...
PropertyNFT deployed to: 0xABC123...

2. Deploying PropertyMarketplace...
PropertyMarketplace deployed to: 0xDEF456...

Deployment info saved to: ./deployments/campTestnet.json

✅ Deployment completed successfully!

Contract Addresses:
-------------------
PropertyNFT: 0xABC123...
PropertyMarketplace: 0xDEF456...

Add these addresses to your frontend .env file:
VITE_PROPERTY_NFT_ADDRESS=0xABC123...
VITE_MARKETPLACE_ADDRESS=0xDEF456...
```

### Step 2: Update Frontend Environment

After successful deployment, add the contract addresses to `/frontend/lanfriq/.env`:

```bash
VITE_PROPERTY_NFT_ADDRESS=0xABC123...
VITE_MARKETPLACE_ADDRESS=0xDEF456...
```

### Step 3: Create Contract Interaction Utilities

Create `/frontend/lanfriq/src/utils/contractUtils.js`:

```javascript
import { ethers } from 'ethers';
import PropertyNFTABI from '../../../contracts/artifacts/contracts/PropertyNFT.sol/PropertyNFT.json';
import PropertyMarketplaceABI from '../../../contracts/artifacts/contracts/PropertyMarketplace.sol/PropertyMarketplace.json';

const PROPERTY_NFT_ADDRESS = import.meta.env.VITE_PROPERTY_NFT_ADDRESS;
const MARKETPLACE_ADDRESS = import.meta.env.VITE_MARKETPLACE_ADDRESS;

export const getPropertyNFTContract = (signer) => {
  return new ethers.Contract(
    PROPERTY_NFT_ADDRESS,
    PropertyNFTABI.abi,
    signer
  );
};

export const getMarketplaceContract = (signer) => {
  return new ethers.Contract(
    MARKETPLACE_ADDRESS,
    PropertyMarketplaceABI.abi,
    signer
  );
};

// Example: Mint a property NFT
export const mintPropertyNFT = async (signer, propertyData) => {
  const contract = getPropertyNFTContract(signer);
  
  const tx = await contract.mintProperty(
    propertyData.to,
    propertyData.address,
    propertyData.valuation,
    propertyData.totalShares,
    propertyData.pricePerShare,
    propertyData.uri
  );
  
  const receipt = await tx.wait();
  return receipt;
};

// Example: Create a marketplace listing
export const createListing = async (signer, listingData) => {
  const contract = getMarketplaceContract(signer);
  
  const tx = await contract.createListing(
    listingData.propertyTokenId,
    listingData.pricePerShare,
    listingData.sharesAvailable,
    listingData.paymentToken || ethers.ZeroAddress
  );
  
  const receipt = await tx.wait();
  return receipt;
};
```

### Step 4: Test Frontend Integration

```bash
cd /home/maverick/Desktop/lanfriq/frontend/lanfriq

# Install dependencies (if needed)
npm install

# Start development server
npm run dev
```

Test the following:
- ✅ Connect wallet via RainbowKit
- ✅ Camp Modal authentication
- ✅ Mint property IPNFT
- ✅ View minted properties
- ✅ Create marketplace listing
- ✅ Link social accounts

---

## 🔍 Verification

### Verify Contracts on Block Explorer

After deployment, verify your contracts:

```bash
npx hardhat verify --network campTestnet <PROPERTY_NFT_ADDRESS>
npx hardhat verify --network campTestnet <MARKETPLACE_ADDRESS>
```

### Check Deployment Info

```bash
cat deployments/campTestnet.json
```

---

## 🐛 Troubleshooting

### "Insufficient funds for gas"
- Ensure your wallet has testnet CAMP tokens
- Check the faucet or contact Camp Network team

### "Invalid private key"
- Ensure PRIVATE_KEY in `.env` doesn't have `0x` prefix
- Ensure no extra spaces or quotes

### "Network connection error"
- Verify RPC URL is correct
- Check if Camp Network testnet is operational

### "Contract deployment failed"
- Check gas settings in `hardhat.config.js`
- Ensure wallet is connected to correct network

---

## 📋 Post-Deployment Tasks

1. **Update Documentation**: Document deployed contract addresses
2. **Test All Features**: Run through complete user flow
3. **Monitor Transactions**: Check block explorer for all transactions
4. **Set Up Marketplace**: Initialize marketplace with PropertyNFT address
5. **Security Audit**: Consider auditing contracts before mainnet

---

## 🎯 Mainnet Deployment (When Ready)

```bash
# Deploy to Camp Mainnet
npx hardhat run scripts/deploy.js --network campMainnet

# Verify contracts
npx hardhat verify --network campMainnet <ADDRESS>
```

**Important**: 
- Test thoroughly on testnet first
- Have sufficient CAMP tokens for gas
- Consider a security audit
- Update frontend .env to PRODUCTION mode

---

## ✅ Changes Made

### 1. Updated CampContext.jsx
- ✅ Changed from `Auth` class to `campModal`
- ✅ Using `campModal.init()` for initialization
- ✅ Using `campModal.connect()` for authentication
- ✅ Accessing `campModal.auth` and `campModal.origin`
- ✅ Proper event listeners for state changes
- ✅ Clean disconnect handling

### Benefits of campModal:
- 🎨 Built-in UI for authentication
- 🔐 Better wallet connection handling
- 📱 Mobile-friendly modal interface
- ✨ Automatic state management
- 🔄 Simplified integration

---

## 📞 Support

- Camp Network Docs: Check official documentation
- GitHub Issues: Report bugs in the repository
- Discord/Telegram: Join Camp Network community

---

**Ready to Deploy?** Run the commands above! 🚀
