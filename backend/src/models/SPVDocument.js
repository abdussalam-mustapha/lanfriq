import mongoose from 'mongoose';

const spvDocumentSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
      unique: true,
      index: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Document Details
    documentType: {
      type: String,
      default: 'SPV',
    },
    documentNumber: {
      type: String,
      unique: true,
    },
    
    // SPV Information
    spvDetails: {
      companyName: String,
      registrationNumber: String,
      jurisdiction: String,
      registrationDate: Date,
      directors: [
        {
          name: String,
          title: String,
          address: String,
        },
      ],
      shareholders: [
        {
          name: String,
          sharePercentage: Number,
        },
      ],
    },

    // Property Information (snapshot at time of SPV generation)
    propertySnapshot: {
      title: String,
      address: String,
      valuation: Number,
      totalShares: Number,
      sharePrice: Number,
    },

    // Document Storage
    documentUrl: {
      type: String,
      required: true,
    },
    ipfsHash: String,
    documentHash: {
      type: String,
      required: true,
    },
    
    // Template Used
    templateVersion: {
      type: String,
      default: 'v1.0',
    },
    
    // Status
    status: {
      type: String,
      enum: ['draft', 'generated', 'signed', 'finalized', 'archived'],
      default: 'generated',
    },
    
    // Signatures
    signatures: [
      {
        signedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        signedAt: Date,
        signature: String,
        ipAddress: String,
      },
    ],

    // Metadata
    generatedAt: {
      type: Date,
      default: Date.now,
    },
    finalizedAt: Date,
    expiresAt: Date,
    
    notes: String,
    version: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to generate document number
spvDocumentSchema.pre('save', async function (next) {
  if (this.isNew && !this.documentNumber) {
    const date = new Date();
    const year = date.getFullYear();
    const count = await mongoose.model('SPVDocument').countDocuments();
    this.documentNumber = `SPV-${year}-${String(count + 1).padStart(6, '0')}`;
  }
  next();
});

// Method to finalize document
spvDocumentSchema.methods.finalize = function () {
  this.status = 'finalized';
  this.finalizedAt = new Date();
  return this.save();
};

const SPVDocument = mongoose.model('SPVDocument', spvDocumentSchema);

export default SPVDocument;
