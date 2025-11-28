# Camp Network Origin SDK Integration Guide

## Overview

This document explains the Camp Network Origin SDK integration in the Lanfriq frontend application. The integration enables tokenization of real-world assets as IPNFTs (Intellectual Property NFTs) on the Camp Network blockchain.

## Architecture

### 1. Chain Configuration

**File:** `/src/config/wagmi.js`

The Camp Network testnet (Basecamp) has been added to the wagmi configuration:

```javascript
export const campTestnet = defineChain({
  id: 123420001114,
  name: 'Basecamp Testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'CAMP',
    symbol: 'CAMP',
  },
  rpcUrls: {
    default: { http: ['https://rpc.basecamp.t.raas.gelato.cloud'] },
    public: { http: ['https://rpc-campnetwork.xyz'] },
  },
  blockExplorers: {
    default: {
      name: 'Basecamp Explorer',
      url: 'https://basecamp.cloud.blockscout.com',
    },
  },
  testnet: true,
})
```

### 2. Context Provider

**File:** `/src/context/CampContext.jsx`

The `CampProvider` wraps the Origin SDK's `Auth` class and provides:

- **Authentication management**: Automatically connects to Origin when wallet is connected
- **Social account management**: Link/unlink Twitter, Spotify, TikTok accounts
- **Origin SDK access**: Provides `origin` instance for blockchain interactions

**Usage:**
```javascript
const { 
  auth,               // Auth instance
  origin,             // Origin SDK for blockchain calls
  isAuthenticated,    // Authentication state
  isLoading,          // Loading state
  linkedSocials,      // { twitter, spotify, tiktok }
  connectToOrigin,    // Manual connect function
  linkTwitter,        // Link Twitter account
  linkSpotify,        // Link Spotify account
  linkTikTok,         // Link TikTok account (requires handle)
  unlinkTwitter,      // Unlink Twitter
  unlinkSpotify,      // Unlink Spotify
  unlinkTikTok,       // Unlink TikTok
} = useCamp();
```

### 3. Utility Functions

**File:** `/src/utils/campUtils.js`

Provides helper functions for common Origin SDK operations:

#### License Terms Creation
```javascript
// Create default license terms
const license = createPropertyLicenseTerms({
  price: "0.001",          // Price in CAMP
  durationDays: 30,        // Duration in days
  royaltyPercent: 10,      // Royalty percentage
  paymentToken: zeroAddress // Native CAMP token
});
```

#### Minting IPNFTs
```javascript
// Mint property IPNFT
const tokenId = await mintPropertyIPNFT(
  origin,
  file,                    // File to upload
  {
    name: "Property Name",
    description: "Description",
    image: "image-url",
    attributes: []
  },
  license,
  [],                      // Parent token IDs (for derivatives)
  (progress) => console.log(progress) // Progress callback
);

// Mint social IPNFT
const tokenId = await mintSocialIPNFT(
  origin,
  "twitter",               // "twitter" | "spotify" | "tiktok"
  metadata,
  license
);
```

#### Marketplace Operations
```javascript
// Buy access to an IPNFT
await buyIPNFTAccess(origin, tokenId);

// Check if user has access
const hasAccess = await checkIPNFTAccess(origin, tokenId, userAddress);

// Get IPNFT data (requires access)
const data = await getIPNFTData(origin, tokenId);

// Get license terms
const terms = await getIPNFTTerms(origin, tokenId);
```

#### Royalty Management
```javascript
// Get royalty information
const royaltyInfo = await getRoyaltyInfo(origin, tokenId, ownerAddress);

// Claim royalties
await claimRoyalties(origin, tokenId, ownerAddress);
```

#### Formatting Utilities
```javascript
// Format price from wei to CAMP
formatCampPrice(priceInWei); // "0.0010 CAMP"

// Format duration from seconds
formatDuration(86400); // "1 day"

// Format royalty from basis points
formatRoyalty(1000); // "10.00%"
```

## Integration Points

### 1. Tokenization Hub

**File:** `/src/pages/tokenization-hub/TokenizationHub.jsx`

The Tokenization Hub now mints IPNFTs on Camp Network when properties are published:

```javascript
const handlePublish = async (tokenData) => {
  // Create license terms
  const license = createPropertyLicenseTerms({
    price: tokenData.price || "0.001",
    durationDays: tokenData.duration || 30,
    royaltyPercent: tokenData.royalty || 10,
  });

  // Prepare metadata with property details
  const metadata = {
    name: propertyData.formData.propertyName,
    description: propertyData.formData.description,
    image: assetImage,
    attributes: [
      { trait_type: 'Type', value: propertyData.formData.propertyType },
      { trait_type: 'Location', value: propertyData.formData.location },
      { trait_type: 'Value', value: propertyData.formData.valuation },
    ],
  };

  // Mint IPNFT
  const tokenId = await mintPropertyIPNFT(
    origin,
    propertyData.formData.assetImage,
    metadata,
    license,
    [],
    (progress) => setMintingProgress(progress)
  );
  
  console.log('IPNFT minted! Token ID:', tokenId);
};
```

**Features:**
- Uploads property documents to IPFS
- Mints IPNFT with configurable license terms
- Tracks minting progress
- Stores token ID for reference

### 2. NFT Marketplace

**File:** `/src/pages/nft/NFT.jsx`

The NFT page displays both regular NFTs and IPNFTs from Camp Network:

```javascript
// Fetch user's IPNFTs
const fetchUserIPNFTs = async () => {
  const balance = await origin.balanceOf(address);
  
  for (let i = 0; i < balance; i++) {
    const tokenId = `${i + 1}`;
    const terms = await getIPNFTTerms(origin, tokenId);
    const tokenURI = await origin.tokenURI(tokenId);
    
    nfts.push({
      id: tokenId,
      name: `Property IPNFT #${tokenId}`,
      price: formatCampPrice(terms.price),
      duration: formatDuration(terms.duration),
      royalty: formatRoyalty(terms.royaltyBps),
      chain: 'Camp Network',
      isIPNFT: true,
    });
  }
};

// Buy access to an IPNFT
const handleBuyAccess = async (nft) => {
  await buyIPNFTAccess(origin, nft.tokenId);
  alert('Successfully purchased access!');
};
```

**Features:**
- Displays user's owned IPNFTs
- Shows IPNFT badge on tokenized properties
- Allows buying access to IPNFTs
- Checks user access status
- Displays license terms (price, duration, royalty)

### 3. Settings - Social Linking

**File:** `/src/pages/settings/Settings.jsx`

The Settings page includes social account management for IPNFT minting:

```javascript
// Link Twitter
<button onClick={linkTwitter}>
  {linkedSocials.twitter ? 'Linked' : 'Link'}
</button>

// Link Spotify
<button onClick={linkSpotify}>
  {linkedSocials.spotify ? 'Linked' : 'Link'}
</button>

// Link TikTok
<input 
  value={tiktokHandle}
  onChange={(e) => setTiktokHandle(e.target.value)}
  placeholder="Enter TikTok handle"
/>
<button onClick={() => linkTikTok(tiktokHandle)}>
  {linkedSocials.tiktok ? 'Linked' : 'Link'}
</button>
```

**Features:**
- Visual indicators for linked accounts
- OAuth redirects for Twitter and Spotify
- Manual handle entry for TikTok
- Unlink functionality
- Warning when wallet not connected

## Configuration

### Environment Variables

Create a `.env` file in the frontend directory:

```env
# Camp Network Configuration
VITE_CAMP_CLIENT_ID=lanfriq-app              # Your Camp Network client ID
VITE_CAMP_ENVIRONMENT=DEVELOPMENT            # DEVELOPMENT or PRODUCTION
VITE_WALLETCONNECT_PROJECT_ID=your-project-id # WalletConnect project ID
```

### Client ID

To get your Camp Network client ID:
1. Visit [Camp Network Dashboard](https://camp.network)
2. Create a new application
3. Copy the client ID
4. Update in `/src/context/CampContext.jsx`:

```javascript
const authInstance = new Auth({
  clientId: import.meta.env.VITE_CAMP_CLIENT_ID || 'lanfriq-app',
  // ...
});
```

## License Terms Constraints

When minting or updating IPNFTs, the following constraints apply:

- **Price**: Minimum 0.001 CAMP (1000000000000000 wei)
- **Duration**: Between 1 day (86400s) and 30 days (2628000s)
- **Royalty**: Between 0.01% (1 bps) and 100% (10000 bps)
- **Payment Token**: Use `zeroAddress` from viem for native CAMP

## Revenue Sharing (Derivatives)

Lanfriq can enable app-level revenue sharing using the derivative system:

### Setup

1. **Mint a base IPNFT** for the Lanfriq platform with desired royalty percentage
2. **Set baseParentId** in CampProvider:

```javascript
<CampProvider 
  clientId="lanfriq-app"
  baseParentId={123n} // Your base IPNFT token ID
>
  <App />
</CampProvider>
```

3. All user-minted IPNFTs will automatically become derivatives of the base IPNFT
4. Platform royalties flow automatically on every subscription
5. Claim royalties from the Creator Dashboard

### Manual Derivative Creation

```javascript
// Mint with specific parents
const tokenId = await mintPropertyIPNFT(
  origin,
  file,
  metadata,
  license,
  [parentTokenId1, parentTokenId2], // Up to 8 parents
  progressCallback
);
```

## Testing

### Development Flow

1. **Connect Wallet**: Use RainbowKit to connect to Camp Testnet
2. **Authenticate**: CampContext auto-connects to Origin SDK
3. **Link Socials** (optional): Navigate to Settings → Security
4. **Create Property**: Use Tokenization Hub to submit property
5. **Mint IPNFT**: Configure token details and publish
6. **View NFTs**: Check NFT page for minted IPNFTs
7. **Buy Access**: Test purchasing access to other IPNFTs

### Test Accounts

For testing, you'll need:
- Testnet CAMP tokens (from faucet)
- Test property documents/images
- Social accounts for linking (optional)

### Useful Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## API Reference

### CampContext

| Property | Type | Description |
|----------|------|-------------|
| `auth` | `Auth` | Origin SDK Auth instance |
| `origin` | `Origin` | Origin SDK for blockchain calls |
| `isAuthenticated` | `boolean` | Authentication status |
| `isLoading` | `boolean` | Loading state |
| `linkedSocials` | `object` | Social linking status |
| `connectToOrigin` | `function` | Manual connect function |
| `linkTwitter` | `function` | Link Twitter account |
| `linkSpotify` | `function` | Link Spotify account |
| `linkTikTok` | `function` | Link TikTok (requires handle) |
| `unlinkTwitter` | `function` | Unlink Twitter |
| `unlinkSpotify` | `function` | Unlink Spotify |
| `unlinkTikTok` | `function` | Unlink TikTok |

### CampUtils Functions

| Function | Parameters | Returns | Description |
|----------|-----------|---------|-------------|
| `createPropertyLicenseTerms` | `options` | `LicenseTerms` | Create validated license terms |
| `mintPropertyIPNFT` | `origin, file, metadata, license, parents, callback` | `Promise<string>` | Mint property IPNFT |
| `mintSocialIPNFT` | `origin, source, metadata, license` | `Promise<string>` | Mint social IPNFT |
| `updateIPNFTLicense` | `origin, tokenId, newLicense` | `Promise<void>` | Update license terms |
| `buyIPNFTAccess` | `origin, tokenId` | `Promise<void>` | Buy IPNFT access |
| `checkIPNFTAccess` | `origin, tokenId, userAddress` | `Promise<boolean>` | Check user access |
| `getIPNFTData` | `origin, tokenId` | `Promise<any>` | Get IPNFT data |
| `getIPNFTTerms` | `origin, tokenId` | `Promise<LicenseTerms>` | Get license terms |
| `getRoyaltyInfo` | `origin, tokenId, ownerAddress` | `Promise<object>` | Get royalty info |
| `claimRoyalties` | `origin, tokenId, ownerAddress` | `Promise<void>` | Claim royalties |
| `formatCampPrice` | `priceInWei` | `string` | Format wei to CAMP |
| `formatDuration` | `seconds` | `string` | Format duration |
| `formatRoyalty` | `bps` | `string` | Format royalty % |

## Troubleshooting

### Common Issues

1. **"Origin SDK not initialized"**
   - Ensure wallet is connected
   - Check CampProvider is in component tree
   - Verify authentication status

2. **Minting fails**
   - Check CAMP token balance for gas
   - Verify license terms meet constraints
   - Ensure file size is reasonable

3. **Social linking not working**
   - Verify redirect URIs in Camp dashboard
   - Check browser doesn't block OAuth popups
   - Ensure wallet is connected first

4. **Can't see minted IPNFTs**
   - Wait for blockchain confirmation
   - Refresh the page
   - Check block explorer for transaction

## Resources

- [Camp Network Documentation](https://docs.camp.network)
- [Origin SDK GitHub](https://github.com/campnetwork/origin)
- [Basecamp Block Explorer](https://basecamp.cloud.blockscout.com)
- [Camp Network Dashboard](https://camp.network)

## Support

For issues related to:
- **Lanfriq Integration**: Contact development team
- **Origin SDK**: Check [Origin SDK docs](https://docs.camp.network/origin)
- **Camp Network**: Visit [Camp Network Discord](https://discord.gg/campnetwork)

## Next Steps

1. **Get Client ID**: Register app on Camp Network
2. **Test Minting**: Create test property IPNFTs
3. **Configure Royalties**: Set up revenue sharing if needed
4. **Production Deploy**: Switch to PRODUCTION environment
5. **Monitor**: Track IPNFTs on block explorer

---

**Last Updated**: November 27, 2025  
**SDK Version**: @campnetwork/origin latest  
**Network**: Camp Network Testnet (Basecamp)
