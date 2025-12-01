import { Property, User, SPVDocument } from '../models/index.js';
import ApiError from '../utils/errors.js';
import { asyncHandler } from '../utils/errors.js';
import logger from '../utils/logger.js';

// @desc    Get all properties with filters
// @route   GET /api/v1/properties
// @access  Public
export const getAllProperties = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    status,
    propertyType,
    city,
    country,
    minPrice,
    maxPrice,
    verificationStatus,
    isTokenized,
    sortBy = '-createdAt',
  } = req.query;

  const query = { isActive: true };

  // Apply filters
  if (status) query.status = status;
  if (propertyType) query.propertyType = propertyType;
  if (city) query['location.city'] = new RegExp(city, 'i');
  if (country) query['location.country'] = new RegExp(country, 'i');
  if (verificationStatus) query.verificationStatus = verificationStatus;
  if (isTokenized !== undefined) query['tokenization.isTokenized'] = isTokenized === 'true';

  // Price range
  if (minPrice || maxPrice) {
    query['valuation.amount'] = {};
    if (minPrice) query['valuation.amount'].$gte = Number(minPrice);
    if (maxPrice) query['valuation.amount'].$lte = Number(maxPrice);
  }

  const skip = (page - 1) * limit;

  const properties = await Property.find(query)
    .populate('owner', 'walletAddress username profile')
    .sort(sortBy)
    .limit(Number(limit))
    .skip(skip);

  const total = await Property.countDocuments(query);

  res.json({
    success: true,
    count: properties.length,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    data: properties,
  });
});

// @desc    Get single property
// @route   GET /api/v1/properties/:id
// @access  Public
export const getProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id)
    .populate('owner', 'walletAddress username profile')
    .populate('listing');

  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  // Increment view count
  property.views += 1;
  await property.save();

  res.json({
    success: true,
    data: property,
  });
});

// @desc    Create new property
// @route   POST /api/v1/properties
// @access  Private
export const createProperty = asyncHandler(async (req, res) => {
  const propertyData = {
    ...req.body,
    owner: req.user._id,
    status: 'draft',
  };

  const property = await Property.create(propertyData);

  logger.info(`Property created: ${property._id} by user ${req.user._id}`);

  res.status(201).json({
    success: true,
    data: property,
  });
});

// @desc    Update property
// @route   PUT /api/v1/properties/:id
// @access  Private (Owner only)
export const updateProperty = asyncHandler(async (req, res) => {
  let property = await Property.findById(req.params.id);

  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  // Check ownership
  if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to update this property');
  }

  // Don't allow updates if already tokenized
  if (property.tokenization.isTokenized) {
    throw new ApiError(400, 'Cannot update tokenized property');
  }

  property = await Property.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.json({
    success: true,
    data: property,
  });
});

// @desc    Submit property for verification
// @route   POST /api/v1/properties/:id/submit
// @access  Private (Owner only)
export const submitPropertyForVerification = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  // Check ownership
  if (property.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to submit this property');
  }

  // Validate property is ready for submission
  if (property.status !== 'draft') {
    throw new ApiError(400, 'Property has already been submitted');
  }

  if (!property.legalDocuments || property.legalDocuments.length === 0) {
    throw new ApiError(400, 'Please upload legal documents before submission');
  }

  // Update property status
  property.status = 'submitted';
  property.verificationStatus = 'pending';
  property.verificationDetails.submittedAt = new Date();

  await property.save();

  logger.info(`Property submitted for verification: ${property._id}`);

  // TODO: Send notification to verifiers

  res.json({
    success: true,
    message: 'Property submitted for verification',
    data: property,
  });
});

// @desc    Update verification fee payment
// @route   POST /api/v1/properties/:id/verification-fee
// @access  Private (Owner only)
export const recordVerificationFeePayment = asyncHandler(async (req, res) => {
  const { transactionHash, amount } = req.body;

  if (!transactionHash) {
    throw new ApiError(400, 'Transaction hash is required');
  }

  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  // Check ownership
  if (property.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, 'Not authorized to update this property');
  }

  // Update verification fee
  property.verificationFee = {
    paid: true,
    transactionHash,
    paidAt: new Date(),
    amount: amount || '0.5',
  };

  await property.save();

  logger.info(`Verification fee paid for property: ${property._id}, tx: ${transactionHash}`);

  res.json({
    success: true,
    message: 'Verification fee payment recorded',
    data: property,
  });
});

// @desc    Get user's properties
// @route   GET /api/v1/properties/my/properties
// @access  Private
export const getMyProperties = asyncHandler(async (req, res) => {
  const properties = await Property.find({ owner: req.user._id })
    .sort('-createdAt')
    .populate('listing');

  res.json({
    success: true,
    count: properties.length,
    data: properties,
  });
});

// @desc    Delete property
// @route   DELETE /api/v1/properties/:id
// @access  Private (Owner/Admin only)
export const deleteProperty = asyncHandler(async (req, res) => {
  const property = await Property.findById(req.params.id);

  if (!property) {
    throw new ApiError(404, 'Property not found');
  }

  // Check ownership
  if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    throw new ApiError(403, 'Not authorized to delete this property');
  }

  // Don't allow deletion if tokenized
  if (property.tokenization.isTokenized) {
    throw new ApiError(400, 'Cannot delete tokenized property');
  }

  // Soft delete
  property.isActive = false;
  property.status = 'archived';
  await property.save();

  res.json({
    success: true,
    message: 'Property deleted successfully',
  });
});

export default {
  getAllProperties,
  getProperty,
  createProperty,
  updateProperty,
  submitPropertyForVerification,
  recordVerificationFeePayment,
  getMyProperties,
  deleteProperty,
};
