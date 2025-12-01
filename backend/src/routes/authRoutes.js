import express from 'express';
import {
  walletAuth,
  getMe,
  updateProfile,
  refreshToken,
  logout,
} from '../controllers/authController.js';
import { protect, authenticateWallet, getNonce } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/nonce/:walletAddress', getNonce);
router.post('/wallet', authenticateWallet, walletAuth);
router.post('/refresh', refreshToken);

// Protected routes
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.post('/logout', protect, logout);

export default router;
