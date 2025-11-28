import { createLicenseTerms } from '@campnetwork/origin';
import { zeroAddress, parseEther } from 'viem';

/**
 * Default license terms for property IPNFTs
 * Price: 0.001 CAMP (minimum allowed)
 * Duration: 30 days
 * Royalty: 10% (1000 basis points)
 * Payment Token: Native CAMP token
 */
export const DEFAULT_LICENSE_TERMS = {
  price: BigInt("1000000000000000"), // 0.001 CAMP in wei
  duration: 2628000, // 30 days in seconds
  royaltyBps: 1000, // 10% royalty
  paymentToken: zeroAddress, // Native CAMP token
};

/**
 * Create validated license terms for IPNFT minting
 * @param {Object} options - License configuration options
 * @param {string|bigint} options.price - Price in CAMP (e.g., "0.001" or wei amount)
 * @param {number} options.durationDays - Duration in days (1-30)
 * @param {number} options.royaltyPercent - Royalty percentage (0.01-100)
 * @param {string} options.paymentToken - Payment token address (defaults to native CAMP)
 * @returns {LicenseTerms} Validated license terms object
 */
export function createPropertyLicenseTerms({
  price = "0.001",
  durationDays = 30,
  royaltyPercent = 10,
  paymentToken = zeroAddress,
} = {}) {
  // Convert price to wei if it's a string
  const priceInWei = typeof price === 'string' ? parseEther(price) : BigInt(price);
  
  // Convert days to seconds
  const durationInSeconds = durationDays * 86400;
  
  // Convert percentage to basis points (1% = 100 bps)
  const royaltyInBps = Math.floor(royaltyPercent * 100);
  
  return createLicenseTerms(
    priceInWei,
    durationInSeconds,
    royaltyInBps,
    paymentToken
  );
}

/**
 * Mint an IPNFT for a property with file upload
 * @param {Object} origin - Origin SDK instance
 * @param {File} file - Property document/image file
 * @param {Object} metadata - IPNFT metadata
 * @param {string} metadata.name - Property name
 * @param {string} metadata.description - Property description
 * @param {string} metadata.image - Property image URL
 * @param {Array} metadata.attributes - Additional attributes
 * @param {LicenseTerms} license - License terms
 * @param {Array<string>} parents - Optional parent token IDs for derivatives
 * @param {Function} progressCallback - Optional progress callback
 * @returns {Promise<string>} Minted token ID
 */
export async function mintPropertyIPNFT(
  origin,
  file,
  metadata,
  license,
  parents = [],
  progressCallback = null
) {
  if (!origin) {
    throw new Error('Origin SDK not initialized. Please connect your wallet.');
  }

  try {
    const tokenId = await origin.mintFile(
      file,
      {
        name: metadata.name,
        description: metadata.description,
        image: metadata.image,
        attributes: metadata.attributes || [],
      },
      license,
      parents,
      {
        progressCallback,
        useAssetAsPreview: file.type.startsWith('image/'),
      }
    );

    return tokenId;
  } catch (error) {
    console.error('Failed to mint property IPNFT:', error);
    throw error;
  }
}

/**
 * Mint an IPNFT from a linked social account
 * @param {Object} origin - Origin SDK instance
 * @param {string} source - Social platform ("twitter" | "spotify" | "tiktok")
 * @param {Object} metadata - IPNFT metadata
 * @param {LicenseTerms} license - License terms
 * @returns {Promise<string>} Minted token ID
 */
export async function mintSocialIPNFT(origin, source, metadata, license) {
  if (!origin) {
    throw new Error('Origin SDK not initialized. Please connect your wallet.');
  }

  try {
    const tokenId = await origin.mintSocial(source, metadata, license);
    return tokenId;
  } catch (error) {
    console.error('Failed to mint social IPNFT:', error);
    throw error;
  }
}

/**
 * Update license terms for an existing IPNFT
 * @param {Object} origin - Origin SDK instance
 * @param {string} tokenId - Token ID to update
 * @param {LicenseTerms} newLicense - New license terms
 * @returns {Promise<void>}
 */
export async function updateIPNFTLicense(origin, tokenId, newLicense) {
  if (!origin) {
    throw new Error('Origin SDK not initialized. Please connect your wallet.');
  }

  try {
    await origin.updateTerms(tokenId, newLicense);
  } catch (error) {
    console.error('Failed to update IPNFT license:', error);
    throw error;
  }
}

/**
 * Buy access to an IPNFT (smart buy with automatic approval)
 * @param {Object} origin - Origin SDK instance
 * @param {string} tokenId - Token ID to buy access to
 * @returns {Promise<void>}
 */
export async function buyIPNFTAccess(origin, tokenId) {
  if (!origin) {
    throw new Error('Origin SDK not initialized. Please connect your wallet.');
  }

  try {
    await origin.buyAccessSmart(tokenId);
  } catch (error) {
    console.error('Failed to buy IPNFT access:', error);
    throw error;
  }
}

/**
 * Check if user has access to an IPNFT
 * @param {Object} origin - Origin SDK instance
 * @param {string} tokenId - Token ID to check
 * @param {string} userAddress - User wallet address
 * @returns {Promise<boolean>} True if user has access
 */
export async function checkIPNFTAccess(origin, tokenId, userAddress) {
  if (!origin) {
    throw new Error('Origin SDK not initialized. Please connect your wallet.');
  }

  try {
    return await origin.hasAccess(tokenId, userAddress);
  } catch (error) {
    console.error('Failed to check IPNFT access:', error);
    return false;
  }
}

/**
 * Get IPNFT data if user has access
 * @param {Object} origin - Origin SDK instance
 * @param {string} tokenId - Token ID to fetch data for
 * @returns {Promise<any>} IPNFT data
 */
export async function getIPNFTData(origin, tokenId) {
  if (!origin) {
    throw new Error('Origin SDK not initialized. Please connect your wallet.');
  }

  try {
    return await origin.getData(tokenId);
  } catch (error) {
    console.error('Failed to get IPNFT data:', error);
    throw error;
  }
}

/**
 * Get IPNFT license terms
 * @param {Object} origin - Origin SDK instance
 * @param {string} tokenId - Token ID to get terms for
 * @returns {Promise<LicenseTerms>} License terms
 */
export async function getIPNFTTerms(origin, tokenId) {
  if (!origin) {
    throw new Error('Origin SDK not initialized. Please connect your wallet.');
  }

  try {
    return await origin.getTerms(tokenId);
  } catch (error) {
    console.error('Failed to get IPNFT terms:', error);
    throw error;
  }
}

/**
 * Get royalty information for a token
 * @param {Object} origin - Origin SDK instance
 * @param {string} tokenId - Token ID (optional)
 * @param {string} ownerAddress - Owner address (optional)
 * @returns {Promise<Object>} Royalty vault and balance information
 */
export async function getRoyaltyInfo(origin, tokenId = null, ownerAddress = null) {
  if (!origin) {
    throw new Error('Origin SDK not initialized. Please connect your wallet.');
  }

  try {
    return await origin.getRoyalties(tokenId, ownerAddress);
  } catch (error) {
    console.error('Failed to get royalty info:', error);
    throw error;
  }
}

/**
 * Claim royalties for a token
 * @param {Object} origin - Origin SDK instance
 * @param {string} tokenId - Token ID (optional)
 * @param {string} ownerAddress - Owner address (optional)
 * @returns {Promise<void>}
 */
export async function claimRoyalties(origin, tokenId = null, ownerAddress = null) {
  if (!origin) {
    throw new Error('Origin SDK not initialized. Please connect your wallet.');
  }

  try {
    await origin.claimRoyalties(tokenId, ownerAddress);
  } catch (error) {
    console.error('Failed to claim royalties:', error);
    throw error;
  }
}

/**
 * Format price from wei to CAMP
 * @param {bigint} priceInWei - Price in wei
 * @returns {string} Formatted price in CAMP
 */
export function formatCampPrice(priceInWei) {
  try {
    const camp = Number(priceInWei) / 1e18;
    return camp.toFixed(4) + ' CAMP';
  } catch (error) {
    return '0 CAMP';
  }
}

/**
 * Format duration from seconds to human-readable format
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted duration
 */
export function formatDuration(seconds) {
  const days = Math.floor(seconds / 86400);
  if (days > 0) return `${days} day${days > 1 ? 's' : ''}`;
  
  const hours = Math.floor(seconds / 3600);
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  
  const minutes = Math.floor(seconds / 60);
  return `${minutes} minute${minutes > 1 ? 's' : ''}`;
}

/**
 * Format royalty from basis points to percentage
 * @param {number} bps - Royalty in basis points
 * @returns {string} Formatted royalty percentage
 */
export function formatRoyalty(bps) {
  return (bps / 100).toFixed(2) + '%';
}
