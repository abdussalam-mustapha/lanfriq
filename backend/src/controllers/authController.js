import { User } from '../models/index.js';
import ApiError from '../utils/errors.js';
import { asyncHandler } from '../utils/errors.js';
import { generateToken, generateRefreshToken } from '../middleware/auth.js';

// @desc    Authenticate user with wallet
// @route   POST /api/v1/auth/wallet
// @access  Public
export const walletAuth = asyncHandler(async (req, res) => {
  const { walletAddress, signature, message } = req.body;

  if (!walletAddress || !signature || !message) {
    throw new ApiError(400, 'Wallet address, signature, and message are required');
  }

  // The signature verification and user creation is done in the middleware
  // User and tokens are set by authenticateWallet middleware
  const token = req.token;
  const refreshToken = req.refreshToken;
  const user = req.user;

  res.json({
    success: true,
    token,
    refreshToken,
    user: {
      id: user._id,
      walletAddress: user.walletAddress,
      email: user.email,
      username: user.username,
      role: user.role,
      profile: user.profile,
    },
  });
});

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-refreshToken');

  res.json({
    success: true,
    data: user,
  });
});

// @desc    Update user profile
// @route   PUT /api/v1/auth/profile
// @access  Private
export const updateProfile = asyncHandler(async (req, res) => {
  const allowedUpdates = ['email', 'username', 'profile'];
  const updates = {};

  Object.keys(req.body).forEach((key) => {
    if (allowedUpdates.includes(key)) {
      updates[key] = req.body[key];
    }
  });

  const user = await User.findByIdAndUpdate(req.user._id, updates, {
    new: true,
    runValidators: true,
  }).select('-refreshToken');

  res.json({
    success: true,
    data: user,
  });
});

// @desc    Refresh access token
// @route   POST /api/v1/auth/refresh
// @access  Public
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    throw new ApiError(400, 'Refresh token is required');
  }

  // Verify refresh token
  const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
  
  const user = await User.findById(decoded.id);
  
  if (!user || user.refreshToken !== refreshToken) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  // Generate new tokens
  const newToken = generateToken(user._id);
  const newRefreshToken = generateRefreshToken(user._id);

  user.refreshToken = newRefreshToken;
  await user.save();

  res.json({
    success: true,
    token: newToken,
    refreshToken: newRefreshToken,
  });
});

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
export const logout = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.refreshToken = undefined;
  await user.save();

  res.json({
    success: true,
    message: 'Logged out successfully',
  });
});

export default {
  walletAuth,
  getMe,
  updateProfile,
  refreshToken,
  logout,
};
