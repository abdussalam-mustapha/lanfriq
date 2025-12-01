import { ethers } from 'ethers';
import config from '../config/index.js';
import logger from '../utils/logger.js';

// Property NFT ABI (simplified - add full ABI from your contract)
const PROPERTY_NFT_ABI = [
  'function mintProperty(address to, string memory tokenURI) public returns (uint256)',
  'function ownerOf(uint256 tokenId) public view returns (address)',
  'function tokenURI(uint256 tokenId) public view returns (string memory)',
  'function totalSupply() public view returns (uint256)',
  'event PropertyMinted(uint256 indexed tokenId, address indexed owner, string tokenURI)',
];

// Marketplace ABI (simplified - add full ABI from your contract)
const MARKETPLACE_ABI = [
  'function createListing(uint256 propertyId, uint256 pricePerShare, uint256 totalShares, address paymentToken) public returns (uint256)',
  'function buyShares(uint256 listingId, uint256 shares) public payable',
  'function getListing(uint256 listingId) public view returns (tuple)',
  'function getActiveListings(uint256 offset, uint256 limit) public view returns (tuple[])',
  'event ListingCreated(uint256 indexed listingId, uint256 indexed propertyId, address indexed seller)',
  'event SharesPurchased(uint256 indexed listingId, address indexed buyer, uint256 shares)',
];

class BlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.propertyNFTContract = null;
    this.marketplaceContract = null;
    this.initialized = false;
  }

  // Initialize blockchain connection
  async initialize() {
    try {
      // Create provider
      this.provider = new ethers.JsonRpcProvider(config.blockchain.rpcUrl);

      // Create signer for platform wallet
      if (config.blockchain.platformPrivateKey) {
        this.signer = new ethers.Wallet(config.blockchain.platformPrivateKey, this.provider);
      }

      // Initialize contracts
      this.propertyNFTContract = new ethers.Contract(
        config.blockchain.propertyNFTAddress,
        PROPERTY_NFT_ABI,
        this.signer || this.provider
      );

      this.marketplaceContract = new ethers.Contract(
        config.blockchain.marketplaceAddress,
        MARKETPLACE_ABI,
        this.signer || this.provider
      );

      this.initialized = true;
      logger.info('Blockchain service initialized successfully');
    } catch (error) {
      logger.error(`Failed to initialize blockchain service: ${error.message}`);
      throw error;
    }
  }

  // Ensure service is initialized
  ensureInitialized() {
    if (!this.initialized) {
      throw new Error('Blockchain service not initialized. Call initialize() first.');
    }
  }

  // Get property NFT details
  async getPropertyNFT(tokenId) {
    this.ensureInitialized();
    try {
      const owner = await this.propertyNFTContract.ownerOf(tokenId);
      const tokenURI = await this.propertyNFTContract.tokenURI(tokenId);
      
      return {
        tokenId,
        owner,
        tokenURI,
      };
    } catch (error) {
      logger.error(`Error fetching property NFT ${tokenId}: ${error.message}`);
      throw error;
    }
  }

  // Get total minted properties
  async getTotalProperties() {
    this.ensureInitialized();
    try {
      const total = await this.propertyNFTContract.totalSupply();
      return Number(total);
    } catch (error) {
      logger.error(`Error fetching total properties: ${error.message}`);
      throw error;
    }
  }

  // Get listing details
  async getListing(listingId) {
    this.ensureInitialized();
    try {
      const listing = await this.marketplaceContract.getListing(listingId);
      return listing;
    } catch (error) {
      logger.error(`Error fetching listing ${listingId}: ${error.message}`);
      throw error;
    }
  }

  // Get active listings from blockchain
  async getActiveListings(offset = 0, limit = 50) {
    this.ensureInitialized();
    try {
      const listings = await this.marketplaceContract.getActiveListings(offset, limit);
      return listings;
    } catch (error) {
      logger.error(`Error fetching active listings: ${error.message}`);
      throw error;
    }
  }

  // Verify transaction
  async verifyTransaction(txHash) {
    this.ensureInitialized();
    try {
      const receipt = await this.provider.getTransactionReceipt(txHash);
      
      if (!receipt) {
        return {
          verified: false,
          status: 'pending',
          message: 'Transaction not found or still pending',
        };
      }

      const isSuccess = receipt.status === 1;

      return {
        verified: true,
        status: isSuccess ? 'success' : 'failed',
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString(),
        from: receipt.from,
        to: receipt.to,
        confirmations: await receipt.confirmations(),
      };
    } catch (error) {
      logger.error(`Error verifying transaction ${txHash}: ${error.message}`);
      throw error;
    }
  }

  // Get transaction details
  async getTransaction(txHash) {
    this.ensureInitialized();
    try {
      const tx = await this.provider.getTransaction(txHash);
      const receipt = await this.provider.getTransactionReceipt(txHash);

      return {
        transaction: tx,
        receipt,
      };
    } catch (error) {
      logger.error(`Error fetching transaction ${txHash}: ${error.message}`);
      throw error;
    }
  }

  // Listen for PropertyMinted events
  listenToPropertyMints(callback) {
    this.ensureInitialized();
    
    this.propertyNFTContract.on('PropertyMinted', (tokenId, owner, tokenURI, event) => {
      logger.info(`Property minted: TokenID ${tokenId} by ${owner}`);
      callback({
        tokenId: Number(tokenId),
        owner,
        tokenURI,
        transactionHash: event.log.transactionHash,
        blockNumber: event.log.blockNumber,
      });
    });
  }

  // Listen for ListingCreated events
  listenToListingCreations(callback) {
    this.ensureInitialized();
    
    this.marketplaceContract.on('ListingCreated', (listingId, propertyId, seller, event) => {
      logger.info(`Listing created: ID ${listingId} for property ${propertyId}`);
      callback({
        listingId: Number(listingId),
        propertyId: Number(propertyId),
        seller,
        transactionHash: event.log.transactionHash,
        blockNumber: event.log.blockNumber,
      });
    });
  }

  // Listen for SharesPurchased events
  listenToSharePurchases(callback) {
    this.ensureInitialized();
    
    this.marketplaceContract.on('SharesPurchased', (listingId, buyer, shares, event) => {
      logger.info(`Shares purchased: ${shares} shares from listing ${listingId} by ${buyer}`);
      callback({
        listingId: Number(listingId),
        buyer,
        shares: Number(shares),
        transactionHash: event.log.transactionHash,
        blockNumber: event.log.blockNumber,
      });
    });
  }

  // Stop listening to events
  removeAllListeners() {
    if (this.propertyNFTContract) {
      this.propertyNFTContract.removeAllListeners();
    }
    if (this.marketplaceContract) {
      this.marketplaceContract.removeAllListeners();
    }
  }
}

// Create singleton instance
const blockchainService = new BlockchainService();

export default blockchainService;
