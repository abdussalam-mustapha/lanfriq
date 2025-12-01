import express from 'express';
import {
  getAllListings,
  getListing,
  getListingByBlockchainId,
  createListing,
  updateListing,
  recordPurchase,
  delistProperty,
  getMyListings,
} from '../controllers/listingController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllListings);
router.get('/:id', getListing);
router.get('/blockchain/:listingId', getListingByBlockchainId);
router.post('/:id/purchase', recordPurchase);

// Protected routes
router.post('/', protect, createListing);
router.get('/my/listings', protect, getMyListings);
router.put('/:id', protect, updateListing);
router.post('/:id/delist', protect, delistProperty);

export default router;
