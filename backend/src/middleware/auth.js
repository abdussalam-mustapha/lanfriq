import jwt from 'jsonwebtoken';
import config from '../config/index.js';
import { User } from '../models/index.js';
import ApiError from '../utils/errors.js';
import { asyncHandler } from '../utils/errors.js';
import { ethers } from 'ethers';

// Generate JWT token
export const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwt.secret, {
    expiresIn: config.jwt.expire,
  });
};

// Generate refresh token
export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpire,
  });
};

// Verify JWT token
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwt.secret);
  } catch (error) {
    throw new ApiError(401, 'Invalid or expired token');
  }
};

// Protect routes - verify JWT
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Not authorized to access this route');
  }

  try {
    const decoded = verifyToken(token);
    req.user = await User.findById(decoded.id).select('-refreshToken');
    
    if (!req.user) {
      throw new ApiError(401, 'User not found');
    }

    if (!req.user.isActive) {
      throw new ApiError(401, 'User account is deactivated');
    }

    next();
  } catch (error) {
    throw new ApiError(401, 'Not authorized to access this route');
  }
});

// Authorize specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(403, `User role '${req.user.role}' is not authorized to access this route`);
    }
    next();
  };
};

// Verify wallet signature
export const verifyWalletSignature = (message, signature, expectedAddress) => {
  try {
    const recoveredAddress = ethers.verifyMessage(message, signature);
    return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
  } catch (error) {
    return false;
  }
};

// Authenticate with wallet signature
export const authenticateWallet = asyncHandler(async (req, res, next) => {
  const { walletAddress, signature, message } = req.body;

  if (!walletAddress || !signature || !message) {
    throw new ApiError(400, 'Wallet address, signature, and message are required');
  }

  // Verify signature
  const isValid = verifyWalletSignature(message, signature, walletAddress);
  
  if (!isValid) {
    throw new ApiError(401, 'Invalid signature');
  }

  // Find or create user
  let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
  
  if (!user) {
    user = await User.create({
      walletAddress: walletAddress.toLowerCase(),
      lastLogin: new Date(),
    });
  } else {
    user.lastLogin = new Date();
    await user.save();
  }

  // Generate tokens
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  // Save refresh token
  user.refreshToken = refreshToken;
  await user.save();

  req.user = user;
  req.token = token;
  req.refreshToken = refreshToken;

  next();
});

// Get nonce for wallet signature
export const getNonce = asyncHandler(async (req, res) => {
  const { walletAddress } = req.params;

  if (!walletAddress) {
    throw new ApiError(400, 'Wallet address is required');
  }

  let user = await User.findOne({ walletAddress: walletAddress.toLowerCase() });
  
  if (!user) {
    user = await User.create({
      walletAddress: walletAddress.toLowerCase(),
    });
  }

  const nonce = user.generateNonce();
  await user.save();

  res.json({
    success: true,
    nonce,
    message: `Sign this message to authenticate with Lanfriq: ${nonce}`,
  });
});

export default {
  generateToken,
  generateRefreshToken,
  verifyToken,
  protect,
  authorize,
  verifyWalletSignature,
  authenticateWallet,
  getNonce,
};
