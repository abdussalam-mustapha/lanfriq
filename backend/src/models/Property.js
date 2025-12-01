import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema(
  {
    // Basic Property Info
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    propertyType: {
      type: String,
      enum: ['residential', 'commercial', 'industrial', 'land', 'mixed-use'],
      required: true,
    },
    
    // Location
    location: {
      address: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: String,
      country: {
        type: String,
        required: true,
      },
      zipCode: String,
      coordinates: {
        latitude: Number,
        longitude: Number,
      },
    },

    // Property Details
    details: {
      size: {
        value: Number,
        unit: {
          type: String,
          enum: ['sqft', 'sqm', 'acres', 'hectares'],
          default: 'sqft',
        },
      },
      bedrooms: Number,
      bathrooms: Number,
      yearBuilt: Number,
      condition: {
        type: String,
        enum: ['new', 'excellent', 'good', 'fair', 'needs-renovation'],
      },
      amenities: [String],
    },

    // Financial Info
    valuation: {
      amount: {
        type: Number,
        required: true,
      },
      currency: {
        type: String,
        default: 'USD',
      },
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
      valuationType: {
        type: String,
        enum: ['market', 'appraised', 'asking'],
        default: 'market',
      },
    },

    // Ownership & Legal
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    legalDocuments: [
      {
        type: {
          type: String,
          enum: ['title-deed', 'survey', 'tax-records', 'insurance', 'other'],
        },
        name: String,
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
        verified: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // Verification Status
    verificationStatus: {
      type: String,
      enum: ['pending', 'in-review', 'approved', 'rejected', 'requires-update'],
      default: 'pending',
      index: true,
    },
    verificationDetails: {
      submittedAt: Date,
      reviewedAt: Date,
      reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      notes: String,
      rejectionReason: String,
    },
    verificationFee: {
      paid: {
        type: Boolean,
        default: false,
      },
      transactionHash: String,
      paidAt: Date,
      amount: String,
    },

    // Tokenization
    tokenization: {
      isTokenized: {
        type: Boolean,
        default: false,
      },
      tokenizedAt: Date,
      nftTokenId: String,
      ipnftId: String,
      totalShares: Number,
      sharePrice: Number,
      paymentToken: String,
    },

    // SPV Document
    spvDocument: {
      generated: {
        type: Boolean,
        default: false,
      },
      documentUrl: String,
      generatedAt: Date,
      documentHash: String,
    },

    // Media
    images: [
      {
        url: String,
        caption: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    videos: [
      {
        url: String,
        caption: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Metadata
    status: {
      type: String,
      enum: ['draft', 'submitted', 'verified', 'tokenized', 'archived'],
      default: 'draft',
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for efficient queries
propertySchema.index({ 'location.city': 1, 'location.country': 1 });
propertySchema.index({ propertyType: 1, verificationStatus: 1 });
propertySchema.index({ 'valuation.amount': 1 });
propertySchema.index({ createdAt: -1 });

// Virtual for listing
propertySchema.virtual('listing', {
  ref: 'Listing',
  localField: '_id',
  foreignField: 'property',
  justOne: true,
});

// Method to check if property is ready for tokenization
propertySchema.methods.isReadyForTokenization = function () {
  return (
    this.verificationStatus === 'approved' &&
    this.verificationFee.paid &&
    this.spvDocument.generated &&
    !this.tokenization.isTokenized
  );
};

const Property = mongoose.model('Property', propertySchema);

export default Property;
