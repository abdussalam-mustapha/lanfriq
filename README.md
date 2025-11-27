# Lanfriq - Real Estate Tokenization Platform

## Project Overview
Lanfriq is a blockchain-based platform that enables property owners to tokenize real estate assets and allows investors to purchase fractional ownership through secure, verifiable digital tokens with NFT receipts.

## Project Structure

```
lanfriq/
├── frontend/           # React + Vite application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   │   ├── layout/     # Header, Footer, MainLayout
│   │   │   ├── sections/   # Landing page sections
│   │   │   └── ui/         # Button, Card, Section components
│   │   ├── pages/          # Page components
│   │   │   ├── landing/    # Landing page
│   │   │   ├── marketplace/    # Property marketplace
│   │   │   ├── tokenization-hub/   # Property tokenization flow
│   │   │   ├── assets/     # User's token portfolio
│   │   │   ├── offers/     # Token resale management
│   │   │   ├── favorites/  # Saved properties
│   │   │   ├── profile/    # User profile & verification
│   │   │   └── notifications/  # Milestone updates
│   │   ├── context/        # React Context providers
│   │   ├── services/       # API service layer
│   │   ├── hooks/          # Custom React hooks
│   │   ├── utils/          # Utility functions & constants
│   │   ├── routes/         # Routing configuration
│   │   └── assets/         # Images, fonts, icons
│   ├── public/
│   └── package.json
├── backend/            # Node.js + Express API (to be setup)
└── contracts/          # Solidity smart contracts (to be setup)
```

## Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Styling**: CSS Modules with CSS Variables
- **Routing**: React Router DOM
- **Web3**: ethers.js, wagmi, RainbowKit
- **State Management**: React Context API
- **Animations**: Framer Motion, AOS
- **HTTP Client**: Axios

### Backend (Planned)
- **Runtime**: Node.js + Express
- **Database**: PostgreSQL / MongoDB
- **File Storage**: AWS S3 / IPFS
- **Authentication**: JWT + Wallet Signature
- **Document Verification**: Third-party API integration

### Smart Contracts (Planned)
- **Framework**: Hardhat / Foundry
- **Language**: Solidity ^0.8.0
- **Standards**: ERC-20 (tokens), ERC-721 (NFT receipts)
- **Libraries**: OpenZeppelin

## Features Implemented

### ✅ Landing Page
- Hero section with interactive grid animation
- Features showcase
- Target audience sections
- How it works flow
- Statistics display
- CTA section
- Light/Dark theme support
- Responsive design
- AOS scroll animations

### ✅ Core Infrastructure
- React Router setup with protected routes
- Theme system with Context API
- Component architecture (layout, ui, sections)
- API service layer with interceptors
- Constants and configuration management
- Environment variable structure

### 🚧 In Progress
- Wallet integration (MetaMask, WalletConnect)
- User authentication flow
- Property submission workflow
- Marketplace functionality
- Asset management dashboard

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask or compatible Web3 wallet

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/abdussalam-mustapha/lanfriq.git
cd lanfriq
```

2. **Install frontend dependencies**
```bash
cd frontend/lanfriq
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Environment Variables

Create a `.env` file in `frontend/lanfriq/` with the following:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RPC_URL=your_rpc_url
VITE_CHAIN_ID=1
VITE_WALLETCONNECT_PROJECT_ID=your_project_id
VITE_TOKEN_FACTORY_ADDRESS=
VITE_NFT_ADDRESS=
VITE_MARKETPLACE_ADDRESS=
VITE_ESCROW_ADDRESS=
VITE_REVENUE_DISTRIBUTOR_ADDRESS=
```

## User Roles

### Investor (Default)
- Browse marketplace
- Purchase property tokens
- View owned assets and returns
- Resell tokens
- Favorite properties

### Property Owner (Verified)
- Submit property for tokenization
- Upload ownership documents
- Pay verification/valuation fees
- Configure SPV and tokens
- Mint and publish tokens
- Track property performance

## Tokenization Flow

1. **Property Submission** - Details, images, documents
2. **Verification Fee** - Pay combined verification & valuation fee
3. **Document Verification** - Platform verifies ownership docs
4. **Property Valuation** - Professional valuer assigned
5. **SPV Formation** - Pay SPV fee, auto-generate legal structure
6. **Token Configuration** - Set name, symbol, supply, price, access rules
7. **Minting** - Create tokens + NFT receipts
8. **Publish** - List on marketplace

## API Endpoints (Planned)

### Authentication
- `GET /api/auth/nonce/:address` - Get signing nonce
- `POST /api/auth/verify` - Verify wallet signature
- `GET /api/auth/profile` - Get user profile

### Properties
- `GET /api/properties` - List all properties
- `POST /api/properties` - Create property
- `GET /api/properties/:id` - Get property details
- `POST /api/properties/:id/documents` - Upload documents

### Tokenization
- `POST /api/tokenization/:id/pay-verification` - Pay verification fee
- `POST /api/tokenization/:id/pay-spv` - Pay SPV fee
- `POST /api/tokenization/:id/configure` - Configure tokens
- `POST /api/tokenization/:id/mint` - Mint tokens

### Marketplace
- `GET /api/marketplace` - List tokenized properties
- `POST /api/marketplace/purchase` - Buy tokens
- `GET /api/marketplace/offers` - Get resale offers

## Smart Contracts (To Be Developed)

### Core Contracts
1. **PropertyTokenFactory.sol** - Creates ERC-20 tokens for properties
2. **PropertyNFT.sol** - Mints ERC-721 NFT receipts
3. **Marketplace.sol** - Handles token trading
4. **Escrow.sol** - Manages fee payments
5. **RevenueDistributor.sol** - Distributes rental income & appreciation

## Development Roadmap

### Phase 1: Foundation ✅
- [x] Landing page design
- [x] Theme system
- [x] Routing infrastructure
- [x] API service layer

### Phase 2: Authentication & Verification (Current)
- [ ] Wallet connection (RainbowKit)
- [ ] User profile management
- [ ] KYC/KYB verification forms
- [ ] Document upload system

### Phase 3: Tokenization Hub
- [ ] Multi-step property submission
- [ ] Document verification workflow
- [ ] SPV formation integration
- [ ] Token configuration UI
- [ ] Minting interface

### Phase 4: Marketplace
- [ ] Property listing grid
- [ ] Property detail pages
- [ ] Token purchase flow
- [ ] Favorites system
- [ ] Offer management

### Phase 5: Backend Development
- [ ] Express API setup
- [ ] Database schema design
- [ ] Authentication middleware
- [ ] File storage integration
- [ ] Payment processing

### Phase 6: Smart Contracts
- [ ] Contract development
- [ ] Unit testing
- [ ] Integration testing
- [ ] Security audit
- [ ] Deployment scripts

### Phase 7: Integration & Testing
- [ ] Frontend-Backend integration
- [ ] Web3 integration
- [ ] End-to-end testing
- [ ] User acceptance testing

## Contributing

This is a private project. For contribution guidelines, please contact the project owner.

## License

Proprietary - All rights reserved

## Contact

For questions or support, please contact: [Project Owner]

---

**Status**: Active Development
**Last Updated**: November 26, 2025
