import { Listing, Property, Transaction } from '../models/index.js';
import ApiError from '../utils/errors.js';
import { asyncHandler } from '../utils/errors.js';
import logger from '../utils/logger.js';

// @desc    Get all active listings
// @route   GET /api/v1/listings
// @access  Public
export const getAllListings = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    sortBy = '-createdAt',
    minPrice,
    maxPrice,
    isFeatured,
  } = req.query;

  const query = { isActive: true };

  // Apply filters
  if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';
  if (minPrice || maxPrice) {
    query.pricePerShare = {};
    if (minPrice) query.pricePerShare.$gte = minPrice;
    if (maxPrice) query.pricePerShare.$lte = maxPrice;
  }

  const skip = (page - 1) * limit;

  const listings = await Listing.find(query)
    .populate({
      path: 'property',
      populate: { path: 'owner', select: 'walletAddress username profile' },
    })
    .populate('seller', 'walletAddress username profile')
    .sort(sortBy)
    .limit(Number(limit))
    .skip(skip);

  const total = await Listing.countDocuments(query);

  res.json({
    success: true,
    count: listings.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    data: listings,
  });
});

// @desc    Get single listing
// @route   GET /api/v1/listings/:id
// @access  Public
export const getListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate({
      path: 'property',
      populate: { path: 'owner', select: 'walletAddress username profile' },
    })
    .populate('seller', 'walletAddress username profile');

  if (!listing) {
    throw new ApiError(404, 'Listing not found');
  }

  // Increment view count
  listing.views += 1;
  await listing.save();

  res.json({
    success: true,
    data: listing,
  });
});

// @desc    Get listing by listing ID (blockchain ID)
// @route   GET /api/v1/listings/blockchain/:listingId
// @access  Public
export const getListingByBlockchainId = asyncHandler(async (req, res) => {
  const listing = await Listing.findOne({ listingId: req.params.listingId })
    .populate({
      path: 'property',
      populate: { path: 'owner', select: 'walletAddress username profile' },
    })
    .populate('seller', 'walletAddress username profile');

  if (!listing) {
    throw new ApiError(404, 'Listing not found');
  }

  res.json({
    success: true,
    data: listing,
  });
});

// @desc    Create new listing
// @route   POST /api/v1/listings
// @access  Private
export const createListing = asyncHandler(async (req, res) => {
  const { property, listingId, pricePerShare, totalShares, paymentToken, transactionHash } = req.body;

  // Validate property exists and belongs to user
  const propertyDoc = await Property.findById(property);

  if (!propertyDoc) {
    throw new ApiError(404, 'Property not found');
  }

  if (propertyDoc.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to list this property');
  }

  // Check if property is ready for listing
  if (!propertyDoc.tokenization.isTokenized) {
    throw new ApiError(400, 'Property must be tokenized before listing');
  }

  // Check if already listed
  const existingListing = await Listing.findOne({ property });
  if (existingListing && existingListing.isActive) {
    throw new ApiError(400, 'Property is already listed');
  }

  const listing = await Listing.create({
    property,
    listingId,
    seller: req.user._id,
    pricePerShare,
    totalShares,
    sharesAvailable: totalShares,
    paymentToken,
    transactionHash,
    isActive: true,
  });

  logger.info(`Listing created: ${listing._id} for property ${property}`);

  res.status(201).json({
    success: true,
    data: listing,
  });
});

// @desc    Update listing
// @route   PUT /api/v1/listings/:id
// @access  Private (Owner only)
export const updateListing = asyncHandler(async (req, res) => {
  let listing = await Listing.findById(req.params.id);

  if (!listing) {
    throw new ApiError(404, 'Listing not found');
  }

  // Check ownership
  if (listing.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to update this listing');
  }

  listing = await Listing.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    data: listing,
  });
});

// @desc    Record share purchase
// @route   POST /api/v1/listings/:id/purchase
// @access  Public
export const recordPurchase = asyncHandler(async (req, res) => {
  const { shares, buyer, transactionHash, amount } = req.body;

  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    throw new ApiError(404, 'Listing not found');
  }

  if (!listing.isActive) {
    throw new ApiError(400, 'Listing is not active');
  }

  if (shares > listing.sharesAvailable) {
    throw new ApiError(400, 'Not enough shares available');
  }

  // Update listing
  await listing.recordPurchase(shares, buyer, amount);

  logger.info(`Shares purchased: ${shares} from listing ${listing._id}`);

  res.json({
    success: true,
    message: 'Purchase recorded successfully',
    data: listing,
  });
});

// @desc    Delist property
// @route   POST /api/v1/listings/:id/delist
// @access  Private (Owner only)
export const delistProperty = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    throw new ApiError(404, 'Listing not found');
  }

  // Check ownership
  if (listing.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to delist this property');
  }

  listing.isActive = false;
  listing.delistedAt = new Date();
  listing.delistReason = req.body.reason || 'Delisted by owner';

  await listing.save();

  res.json({
    success: true,
    message: 'Listing delisted successfully',
    data: listing,
  });
});

// @desc    Get user's listings
// @route   GET /api/v1/listings/my/listings
// @access  Private
export const getMyListings = asyncHandler(async (req, res) => {
  const listings = await Listing.find({ seller: req.user._id })
    .populate('property')
    .sort('-createdAt');

  res.json({
    success: true,
    count: listings.length,
    data: listings,
  });
});

export default {
  getAllListings,
  getListing,
  getListingByBlockchainId,
  createListing,
  updateListing,
  recordPurchase,
  delistProperty,
  getMyListings,
};
