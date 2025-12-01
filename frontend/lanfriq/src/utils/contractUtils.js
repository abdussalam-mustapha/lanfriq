import { ethers } from 'ethers';
import PropertyNFTABI from '../contracts/PropertyNFT.json';
import PropertyMarketplaceABI from '../contracts/PropertyMarketplace.json';

const PROPERTY_NFT_ADDRESS = import.meta.env.VITE_PROPERTY_NFT_ADDRESS;
const MARKETPLACE_ADDRESS = import.meta.env.VITE_MARKETPLACE_ADDRESS;

export const getPropertyNFTContract = (signerOrProvider) => {
  return new ethers.Contract(
    PROPERTY_NFT_ADDRESS,
    PropertyNFTABI.abi,
    signerOrProvider
  );
};

export const getMarketplaceContract = (signerOrProvider) => {
  return new ethers.Contract(
    MARKETPLACE_ADDRESS,
    PropertyMarketplaceABI.abi,
    signerOrProvider
  );
};

/**
 * Mint a property NFT
 * @param {Object} signer - Ethers signer
 * @param {Object} propertyData - Property details
 * @returns {Promise<Object>} Transaction receipt
 */
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
  
  // Extract tokenId from events
  const event = receipt.logs.find(log => {
    try {
      const parsed = contract.interface.parseLog(log);
      return parsed.name === 'PropertyMinted';
    } catch {
      return false;
    }
  });
  
  if (event) {
    const parsed = contract.interface.parseLog(event);
    return {
      receipt,
      tokenId: parsed.args.tokenId.toString(),
    };
  }
  
  return { receipt, tokenId: null };
};

/**
 * Get property details
 */
export const getProperty = async (provider, tokenId) => {
  const contract = getPropertyNFTContract(provider);
  return await contract.getProperty(tokenId);
};

/**
 * Create a marketplace listing
 */
export const createListing = async (signer, listingData) => {
  const contract = getMarketplaceContract(signer);
  
  const tx = await contract.createListing(
    listingData.propertyTokenId,
    listingData.pricePerShare,
    listingData.sharesAvailable,
    listingData.paymentToken || ethers.ZeroAddress
  );
  
  const receipt = await tx.wait();
  
  // Extract listingId from events
  const event = receipt.logs.find(log => {
    try {
      const parsed = contract.interface.parseLog(log);
      return parsed.name === 'ListingCreated';
    } catch {
      return false;
    }
  });
  
  if (event) {
    const parsed = contract.interface.parseLog(event);
    return {
      receipt,
      listingId: parsed.args.listingId.toString(),
    };
  }
  
  return { receipt, listingId: null };
};

/**
 * Approve ERC20 token for marketplace
 * @param {Object} signer - Ethers signer
 * @param {string} tokenAddress - ERC20 token address
 * @param {bigint} amount - Amount to approve
 * @returns {Promise<Object>} Transaction receipt
 */
export const approveToken = async (signer, tokenAddress, amount) => {
  const erc20ABI = [
    "function approve(address spender, uint256 amount) public returns (bool)"
  ];
  const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, signer);
  const tx = await tokenContract.approve(MARKETPLACE_ADDRESS, amount);
  return await tx.wait();
};

/**
 * Buy shares from a listing
 * @param {Object} signer - Ethers signer
 * @param {number} listingId - Marketplace listing ID
 * @param {number} shares - Number of shares to buy
 * @param {bigint} value - Total value to send (in wei)
 * @param {string} paymentToken - Payment token address (address(0) for native)
 * @returns {Promise<Object>} Transaction receipt
 */
export const buyShares = async (signer, listingId, shares, value, paymentToken) => {
  const contract = getMarketplaceContract(signer);
  
  console.log('buyShares called with:', {
    listingId,
    shares,
    value: value.toString(),
    paymentToken,
    isNativeToken: paymentToken === ethers.ZeroAddress || !paymentToken
  });
  
  // If using ERC20 token, approve first
  if (paymentToken && paymentToken !== ethers.ZeroAddress) {
    console.log('Approving token spend...');
    await approveToken(signer, paymentToken, value);
  }
  
  // For native token (address(0)), send value with transaction
  const txOptions = (paymentToken === ethers.ZeroAddress || !paymentToken) 
    ? { value: value } 
    : {};
  
  console.log('Transaction options:', txOptions);
  
  // Try to estimate gas first to get a better error message
  try {
    const gasEstimate = await contract.buyShares.estimateGas(listingId, shares, txOptions);
    console.log('Gas estimate:', gasEstimate.toString());
  } catch (estimateError) {
    console.error('Gas estimation failed:', estimateError);
    throw new Error(`Transaction will fail: ${estimateError.reason || estimateError.message}`);
  }
  
  const tx = await contract.buyShares(listingId, shares, txOptions);
  
  return await tx.wait();
};

/**
 * Get listing details
 */
export const getListing = async (provider, listingId) => {
  const contract = getMarketplaceContract(provider);
  return await contract.getListing(listingId);
};

/**
 * Get all active listings by iterating through listing IDs
 * Note: This is a workaround since the contract doesn't have a getActiveListings function
 */
export const getActiveListings = async (provider, maxListings = 50) => {
  const contract = getMarketplaceContract(provider);
  const activeListings = [];
  
  // Try to fetch listings starting from ID 1
  for (let i = 1; i <= maxListings; i++) {
    try {
      const listing = await contract.getListing(i);
      
      // Check if listing exists and is active
      if (listing.seller !== ethers.ZeroAddress && listing.isActive) {
        activeListings.push({
          listingId: i,
          ...listing
        });
      }
    } catch (error) {
      // Continue checking even if one fails
      continue;
    }
  }
  
  return activeListings;
};

/**
 * Get all minted properties (regardless of listing status)
 */
export const getAllProperties = async (provider, maxTokens = 50) => {
  const contract = getPropertyNFTContract(provider);
  const properties = [];
  
  // Try to fetch properties starting from ID 1
  for (let i = 1; i <= maxTokens; i++) {
    try {
      const property = await contract.getProperty(i);
      
      // Check if property exists
      if (property.owner !== ethers.ZeroAddress) {
        properties.push({
          tokenId: i,
          ...property
        });
      }
    } catch (error) {
      // Continue checking even if one fails
      continue;
    }
  }
  
  return properties;
};

/**
 * Get property details for a listing
 */
export const getListingWithPropertyDetails = async (provider, listingId) => {
  const listing = await getListing(provider, listingId);
  
  if (listing.seller === ethers.ZeroAddress || !listing.isActive) {
    return null;
  }
  
  const property = await getProperty(provider, listing.propertyTokenId);
  
  return {
    listingId,
    listing,
    property
  };
};

/**
 * Get user's listings
 */
export const getUserListings = async (provider, userAddress) => {
  const contract = getMarketplaceContract(provider);
  return await contract.getUserListings(userAddress);
};

/**
 * Cancel a listing
 */
export const cancelListing = async (signer, listingId) => {
  const contract = getMarketplaceContract(signer);
  const tx = await contract.cancelListing(listingId);
  return await tx.wait();
};

/**
 * Verify a property (owner only)
 */
export const verifyProperty = async (signer, tokenId, verificationHash) => {
  const contract = getPropertyNFTContract(signer);
  const tx = await contract.verifyProperty(tokenId, verificationHash);
  return await tx.wait();
};

export const CONTRACT_ADDRESSES = {
  PropertyNFT: PROPERTY_NFT_ADDRESS,
  PropertyMarketplace: MARKETPLACE_ADDRESS,
};
