import express from 'express';
import {
  getAllProperties,
  getProperty,
  createProperty,
  updateProperty,
  submitPropertyForVerification,
  recordVerificationFeePayment,
  getMyProperties,
  deleteProperty,
} from '../controllers/propertyController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllProperties);
router.get('/:id', getProperty);

// Protected routes
router.post('/', protect, createProperty);
router.get('/my/properties', protect, getMyProperties);
router.put('/:id', protect, updateProperty);
router.post('/:id/submit', protect, submitPropertyForVerification);
router.post('/:id/verification-fee', protect, recordVerificationFeePayment);
router.delete('/:id', protect, deleteProperty);

export default router;
