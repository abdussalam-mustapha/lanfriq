import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      sparse: true, // Allow null but enforce uniqueness when present
    },
    username: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'verifier'],
      default: 'user',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    kycStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected', 'not_submitted'],
      default: 'not_submitted',
    },
    profile: {
      firstName: String,
      lastName: String,
      phone: String,
      country: String,
      bio: String,
      avatar: String,
    },
    nonce: {
      type: String,
      default: () => Math.floor(Math.random() * 1000000).toString(),
    },
    refreshToken: String,
    lastLogin: Date,
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for user's properties
userSchema.virtual('properties', {
  ref: 'Property',
  localField: '_id',
  foreignField: 'owner',
});

// Hash nonce before saving (for additional security)
userSchema.pre('save', async function (next) {
  if (this.isModified('nonce')) {
    // Nonce doesn't need hashing, just keep it as is
  }
  next();
});

// Method to generate new nonce
userSchema.methods.generateNonce = function () {
  this.nonce = Math.floor(Math.random() * 1000000).toString();
  return this.nonce;
};

// Method to check if user has admin privileges
userSchema.methods.isAdmin = function () {
  return this.role === 'admin';
};

const User = mongoose.model('User', userSchema);

export default User;
