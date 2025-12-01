import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    // Transaction Type
    type: {
      type: String,
      enum: ['purchase', 'listing-creation', 'verification-fee', 'transfer', 'other'],
      required: true,
      index: true,
    },

    // Parties Involved
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    fromAddress: {
      type: String,
      required: true,
      lowercase: true,
    },
    toAddress: {
      type: String,
      lowercase: true,
    },

    // Transaction Details
    transactionHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    blockNumber: {
      type: Number,
      required: true,
    },
    blockTimestamp: Date,

    // Related Entities
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      index: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      index: true,
    },

    // Financial Details
    amount: {
      type: String,
      required: true,
    },
    paymentToken: {
      type: String,
      required: true,
    },
    shares: {
      type: Number,
      default: 0,
    },
    pricePerShare: String,

    // Gas Details
    gasUsed: String,
    gasPrice: String,
    gasFee: String,

    // Status
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'failed', 'cancelled'],
      default: 'pending',
      index: true,
    },
    confirmations: {
      type: Number,
      default: 0,
    },

    // Metadata
    metadata: {
      type: mongoose.Schema.Types.Mixed,
    },
    notes: String,
    errorMessage: String,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for efficient queries
transactionSchema.index({ type: 1, status: 1 });
transactionSchema.index({ createdAt: -1 });
transactionSchema.index({ fromAddress: 1, createdAt: -1 });
transactionSchema.index({ toAddress: 1, createdAt: -1 });

// Static method to record a purchase transaction
transactionSchema.statics.recordPurchase = async function (data) {
  const transaction = new this({
    type: 'purchase',
    from: data.buyer,
    fromAddress: data.buyerAddress,
    to: data.seller,
    toAddress: data.sellerAddress,
    transactionHash: data.txHash,
    blockNumber: data.blockNumber,
    blockTimestamp: data.timestamp,
    property: data.property,
    listing: data.listing,
    amount: data.amount,
    paymentToken: data.paymentToken,
    shares: data.shares,
    pricePerShare: data.pricePerShare,
    gasUsed: data.gasUsed,
    gasPrice: data.gasPrice,
    status: 'confirmed',
  });
  
  return transaction.save();
};

// Static method to record verification fee payment
transactionSchema.statics.recordVerificationFee = async function (data) {
  const transaction = new this({
    type: 'verification-fee',
    from: data.payer,
    fromAddress: data.payerAddress,
    toAddress: data.platformAddress,
    transactionHash: data.txHash,
    blockNumber: data.blockNumber,
    blockTimestamp: data.timestamp,
    property: data.property,
    amount: data.amount,
    paymentToken: 'native',
    status: 'confirmed',
  });
  
  return transaction.save();
};

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;
