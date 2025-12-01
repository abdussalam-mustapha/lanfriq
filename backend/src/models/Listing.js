import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
      unique: true,
      index: true,
    },
    listingId: {
      type: Number,
      required: true,
      unique: true,
      index: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    
    // Listing Details
    pricePerShare: {
      type: String,
      required: true,
    },
    totalShares: {
      type: Number,
      required: true,
    },
    sharesAvailable: {
      type: Number,
      required: true,
    },
    paymentToken: {
      type: String,
      required: true,
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // Transaction Hash
    transactionHash: {
      type: String,
      required: true,
    },
    blockNumber: Number,

    // Sales Data
    totalSold: {
      type: Number,
      default: 0,
    },
    totalRevenue: {
      type: String,
      default: '0',
    },
    numberOfBuyers: {
      type: Number,
      default: 0,
    },

    // Metadata
    views: {
      type: Number,
      default: 0,
    },
    favoriteCount: {
      type: Number,
      default: 0,
    },
    lastSaleAt: Date,
    delistedAt: Date,
    delistReason: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
listingSchema.index({ isActive: 1, createdAt: -1 });
listingSchema.index({ seller: 1, isActive: 1 });
listingSchema.index({ pricePerShare: 1 });

// Virtual for purchase history
listingSchema.virtual('purchases', {
  ref: 'Transaction',
  localField: '_id',
  foreignField: 'listing',
});

// Method to calculate fill percentage
listingSchema.methods.getFillPercentage = function () {
  return ((this.totalShares - this.sharesAvailable) / this.totalShares) * 100;
};

// Method to update shares after purchase
listingSchema.methods.recordPurchase = async function (shares, buyer, revenue) {
  this.sharesAvailable -= shares;
  this.totalSold += shares;
  this.totalRevenue = (BigInt(this.totalRevenue) + BigInt(revenue)).toString();
  this.lastSaleAt = new Date();
  
  // Add to unique buyers count (simplified - should check if buyer is new)
  this.numberOfBuyers += 1;
  
  if (this.sharesAvailable === 0) {
    this.isActive = false;
  }
  
  return this.save();
};

const Listing = mongoose.model('Listing', listingSchema);

export default Listing;
