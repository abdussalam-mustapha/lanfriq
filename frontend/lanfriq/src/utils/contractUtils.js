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
 * Buy shares from a listing
 */
export const buyShares = async (signer, listingId, shares, value) => {
  const contract = getMarketplaceContract(signer);
  
  const tx = await contract.buyShares(listingId, shares, {
    value: value, // For native token payments
  });
  
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
