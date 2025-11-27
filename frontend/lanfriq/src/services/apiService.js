import api from './api'

// Auth endpoints
export const authService = {
  // Wallet signature authentication
  getNonce: (walletAddress) => 
    api.get(`/auth/nonce/${walletAddress}`),
  
  verifySignature: (walletAddress, signature) =>
    api.post('/auth/verify', { walletAddress, signature }),
  
  // Profile
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
}

// User verification endpoints
export const verificationService = {
  submitKYC: (data) => api.post('/verification/kyc', data),
  submitKYB: (data) => api.post('/verification/kyb', data),
  getVerificationStatus: () => api.get('/verification/status'),
}

// Property endpoints
export const propertyService = {
  // Property CRUD
  getAllProperties: (params) => api.get('/properties', { params }),
  getProperty: (id) => api.get(`/properties/${id}`),
  createProperty: (data) => api.post('/properties', data),
  updateProperty: (id, data) => api.put(`/properties/${id}`, data),
  deleteProperty: (id) => api.delete(`/properties/${id}`),
  
  // Property submission flow
  submitForVerification: (id) => api.post(`/properties/${id}/submit`),
  uploadDocuments: (id, formData) => 
    api.post(`/properties/${id}/documents`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
}

// Tokenization endpoints
export const tokenizationService = {
  payVerificationFee: (propertyId, paymentData) =>
    api.post(`/tokenization/${propertyId}/pay-verification`, paymentData),
  
  paySPVFee: (propertyId, paymentData) =>
    api.post(`/tokenization/${propertyId}/pay-spv`, paymentData),
  
  configureToken: (propertyId, config) =>
    api.post(`/tokenization/${propertyId}/configure`, config),
  
  mintTokens: (propertyId) =>
    api.post(`/tokenization/${propertyId}/mint`),
  
  publishProperty: (propertyId) =>
    api.post(`/tokenization/${propertyId}/publish`),
}

// Marketplace endpoints
export const marketplaceService = {
  getListedProperties: (params) => api.get('/marketplace', { params }),
  purchaseTokens: (propertyId, amount) =>
    api.post('/marketplace/purchase', { propertyId, amount }),
  createOffer: (data) => api.post('/marketplace/offers', data),
  getOffers: () => api.get('/marketplace/offers'),
  acceptOffer: (offerId) => api.post(`/marketplace/offers/${offerId}/accept`),
  cancelOffer: (offerId) => api.delete(`/marketplace/offers/${offerId}`),
}

// Assets endpoints
export const assetsService = {
  getMyAssets: () => api.get('/assets'),
  getAssetDetails: (assetId) => api.get(`/assets/${assetId}`),
  getPortfolioStats: () => api.get('/assets/portfolio'),
  getNFTReceipt: (tokenId) => api.get(`/assets/nft/${tokenId}`),
}

// Favorites endpoints
export const favoritesService = {
  getFavorites: () => api.get('/favorites'),
  addFavorite: (propertyId) => api.post('/favorites', { propertyId }),
  removeFavorite: (propertyId) => api.delete(`/favorites/${propertyId}`),
}

// Notifications endpoints
export const notificationsService = {
  getNotifications: () => api.get('/notifications'),
  markAsRead: (notificationId) => 
    api.put(`/notifications/${notificationId}/read`),
  markAllAsRead: () => api.put('/notifications/read-all'),
}

// Payment endpoints
export const paymentService = {
  createPaymentIntent: (amount, currency) =>
    api.post('/payments/intent', { amount, currency }),
  confirmPayment: (paymentId) =>
    api.post(`/payments/${paymentId}/confirm`),
}

export default {
  auth: authService,
  verification: verificationService,
  property: propertyService,
  tokenization: tokenizationService,
  marketplace: marketplaceService,
  assets: assetsService,
  favorites: favoritesService,
  notifications: notificationsService,
  payment: paymentService,
}
