// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
export const BLOCKCHAIN_RPC_URL = import.meta.env.VITE_RPC_URL || ''
export const CHAIN_ID = import.meta.env.VITE_CHAIN_ID || 1

// Contract Addresses (to be updated after deployment)
export const CONTRACTS = {
  PROPERTY_TOKEN_FACTORY: import.meta.env.VITE_TOKEN_FACTORY_ADDRESS || '',
  PROPERTY_NFT: import.meta.env.VITE_NFT_ADDRESS || '',
  MARKETPLACE: import.meta.env.VITE_MARKETPLACE_ADDRESS || '',
  ESCROW: import.meta.env.VITE_ESCROW_ADDRESS || '',
  REVENUE_DISTRIBUTOR: import.meta.env.VITE_REVENUE_DISTRIBUTOR_ADDRESS || '',
}

// App Constants
export const USER_ROLES = {
  INVESTOR: 'investor',
  PROPERTY_OWNER: 'property_owner',
}

export const VERIFICATION_STATUS = {
  UNVERIFIED: 'unverified',
  PENDING: 'pending',
  VERIFIED: 'verified',
  REJECTED: 'rejected',
}

export const PROPERTY_STATUS = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  UNDER_VERIFICATION: 'under_verification',
  VERIFIED: 'verified',
  VALUATION_PENDING: 'valuation_pending',
  VALUATION_COMPLETE: 'valuation_complete',
  SPV_FORMATION: 'spv_formation',
  TOKEN_CONFIGURATION: 'token_configuration',
  MINTING: 'minting',
  PUBLISHED: 'published',
  REJECTED: 'rejected',
}

export const PROPERTY_TYPES = {
  RESIDENTIAL: 'residential',
  COMMERCIAL: 'commercial',
  INDUSTRIAL: 'industrial',
  LAND: 'land',
}

// Fee Structure (in wei or USD cents)
export const FEES = {
  VERIFICATION_AND_VALUATION: 100000, // To be configured
  SPV_FORMATION: 200000,
  MINTING: 50000,
}

// Document upload limits
export const DOCUMENT_UPLOAD_LIMIT = 3
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// Pagination
export const ITEMS_PER_PAGE = 12
