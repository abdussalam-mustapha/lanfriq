# Lanfriq Backend API

Backend API for the Lanfriq Property Tokenization Platform - enabling real estate tokenization and fractional ownership on the blockchain.

## 🏗️ Architecture

This backend is built with:
- **Node.js** + **Express.js** - RESTful API framework
- **MongoDB** + **Mongoose** - Database and ODM
- **Ethers.js** - Blockchain interaction
- **JWT** - Authentication with wallet signature verification
- **Winston** - Logging
- **Multer** - File uploads
- **PDFKit** - SPV document generation

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   │   ├── index.js      # Main config
│   │   └── database.js   # MongoDB connection
│   ├── controllers/      # Route controllers
│   │   ├── authController.js
│   │   ├── propertyController.js
│   │   └── listingController.js
│   ├── middleware/       # Custom middleware
│   │   └── auth.js       # Authentication & authorization
│   ├── models/           # Mongoose models
│   │   ├── User.js
│   │   ├── Property.js
│   │   ├── Listing.js
│   │   ├── Transaction.js
│   │   └── SPVDocument.js
│   ├── routes/           # API routes
│   │   ├── authRoutes.js
│   │   ├── propertyRoutes.js
│   │   ├── listingRoutes.js
│   │   └── index.js
│   ├── services/         # Business logic services
│   │   ├── blockchainService.js
│   │   ├── fileService.js
│   │   ├── spvService.js
│   │   └── emailService.js
│   ├── utils/            # Utility functions
│   │   ├── logger.js
│   │   └── errors.js
│   └── server.js         # Main server file
├── uploads/              # File upload directory
├── logs/                 # Application logs
├── .env.example          # Environment variables template
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.0.0
- MongoDB >= 5.0
- npm or yarn

### Installation

1. **Clone and navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Edit `.env` file with your configuration:**
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/lanfriq
   JWT_SECRET=your-secret-key
   BLOCKCHAIN_RPC_URL=https://rpc.basecamp.t.raas.gelato.cloud
   PROPERTY_NFT_ADDRESS=0x52719D5DA42707ec9ddD50A12A8Ec19bA3d1CF73
   MARKETPLACE_ADDRESS=0xBd84e89001247CeDa92fb7763f67192cDd5dA185
   ```

5. **Start MongoDB:**
   ```bash
   # Using mongod
   mongod --dbpath /path/to/data

   # Or using Docker
   docker run -d -p 27017:27017 --name lanfriq-mongo mongo:latest
   ```

6. **Run the server:**
   ```bash
   # Development mode with auto-reload
   npm run dev

   # Production mode
   npm start
   ```

The API will be available at `http://localhost:5000`

## 📡 API Endpoints

### Authentication
- `GET /api/v1/auth/nonce/:walletAddress` - Get nonce for signature
- `POST /api/v1/auth/wallet` - Authenticate with wallet signature
- `GET /api/v1/auth/me` - Get current user (Protected)
- `PUT /api/v1/auth/profile` - Update profile (Protected)
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/logout` - Logout (Protected)

### Properties
- `GET /api/v1/properties` - Get all properties (with filters)
- `GET /api/v1/properties/:id` - Get single property
- `POST /api/v1/properties` - Create property (Protected)
- `PUT /api/v1/properties/:id` - Update property (Protected)
- `GET /api/v1/properties/my/properties` - Get user's properties (Protected)
- `POST /api/v1/properties/:id/submit` - Submit for verification (Protected)
- `POST /api/v1/properties/:id/verification-fee` - Record fee payment (Protected)
- `DELETE /api/v1/properties/:id` - Delete property (Protected)

### Listings
- `GET /api/v1/listings` - Get all active listings
- `GET /api/v1/listings/:id` - Get single listing
- `GET /api/v1/listings/blockchain/:listingId` - Get by blockchain ID
- `POST /api/v1/listings` - Create listing (Protected)
- `PUT /api/v1/listings/:id` - Update listing (Protected)
- `POST /api/v1/listings/:id/purchase` - Record purchase
- `POST /api/v1/listings/:id/delist` - Delist property (Protected)
- `GET /api/v1/listings/my/listings` - Get user's listings (Protected)

### Health Check
- `GET /api/v1/health` - API health status

## 🔐 Authentication Flow

1. **Get Nonce:**
   ```javascript
   GET /api/v1/auth/nonce/0xYourWalletAddress
   // Returns: { nonce: "123456", message: "Sign this message..." }
   ```

2. **Sign Message:**
   ```javascript
   const signature = await signer.signMessage(message);
   ```

3. **Authenticate:**
   ```javascript
   POST /api/v1/auth/wallet
   Body: {
     walletAddress: "0xYour...",
     signature: "0xSigned...",
     message: "Sign this message to authenticate with Lanfriq: 123456"
   }
   // Returns: { token, refreshToken, user }
   ```

4. **Use Token:**
   ```javascript
   headers: {
     Authorization: `Bearer ${token}`
   }
   ```

## 🗄️ Database Models

### User
- Wallet address (unique)
- Email, username
- Role (user, admin, verifier)
- KYC status
- Profile information
- Nonce for authentication

### Property
- Title, description, type
- Location details
- Valuation information
- Legal documents
- Verification status
- Tokenization details
- SPV document
- Media (images, videos)

### Listing
- Property reference
- Seller information
- Price per share
- Total/available shares
- Payment token
- Transaction details
- Sales metrics

### Transaction
- Transaction type
- Parties involved
- Transaction hash
- Financial details
- Gas information
- Status

### SPV Document
- Property reference
- Document details
- SPV information
- Legal signatures
- Storage URLs

## 🔧 Services

### Blockchain Service
- Initialize contract connections
- Get property NFT details
- Get listing information
- Verify transactions
- Listen to blockchain events

### File Service
- Handle file uploads (Multer)
- File validation
- File deletion
- Storage management

### SPV Service
- Generate PDF documents
- Add legal content
- Create database records
- Store documents securely

### Email Service
- Send notifications
- Property submission confirmations
- Verification status updates
- Purchase confirmations
- Welcome emails

## 🛡️ Security Features

- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Request throttling
- **Mongo Sanitize** - Prevent NoSQL injection
- **JWT** - Secure authentication
- **Wallet Signature Verification** - Cryptographic authentication
- **Role-Based Access Control** - Authorization middleware

## 📊 Logging

Logs are stored in `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only
- `exceptions.log` - Uncaught exceptions
- `rejections.log` - Unhandled promise rejections

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 🔄 Event Listeners

The backend listens to blockchain events:
- **PropertyMinted** - New property tokenized
- **ListingCreated** - New listing created
- **SharesPurchased** - Shares bought

## 📦 Deployment

### Environment Setup

1. Set `NODE_ENV=production`
2. Configure production MongoDB URI
3. Set secure JWT secrets
4. Configure email service
5. Set up file storage (AWS S3 or IPFS)

### Production Start

```bash
npm start
```

### Using PM2 (Recommended)

```bash
npm install -g pm2
pm2 start src/server.js --name lanfriq-api
pm2 save
pm2 startup
```

## 🐳 Docker Support

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

```bash
docker build -t lanfriq-backend .
docker run -p 5000:5000 lanfriq-backend
```

## 🤝 Integration with Frontend

The backend is designed to work seamlessly with the React frontend located in `../frontend/lanfriq`.

Key integration points:
- Wallet authentication
- Property submission workflow
- Marketplace data synchronization
- Transaction verification
- File uploads

## 📝 Environment Variables

See `.env.example` for all required environment variables.

Critical variables:
- `MONGODB_URI` - Database connection
- `JWT_SECRET` - Token signing
- `BLOCKCHAIN_RPC_URL` - Web3 provider
- `PROPERTY_NFT_ADDRESS` - NFT contract
- `MARKETPLACE_ADDRESS` - Marketplace contract

## 🐛 Troubleshooting

**MongoDB Connection Issues:**
```bash
# Check if MongoDB is running
mongosh
```

**Port Already in Use:**
```bash
# Change PORT in .env file
PORT=5001
```

**Blockchain Connection:**
```bash
# Verify RPC URL is accessible
curl https://rpc.basecamp.t.raas.gelato.cloud
```

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Documentation](https://mongoosejs.com/)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [JWT Best Practices](https://jwt.io/introduction)

## 📄 License

MIT

## 👥 Support

For issues or questions, please open an issue on GitHub or contact the development team.
