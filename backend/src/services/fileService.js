import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import config from '../config/index.js';
import logger from '../utils/logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads');
await fs.mkdir(uploadDir, { recursive: true });

// Configure multer storage
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const fileType = req.body.fileType || 'general';
    const dest = path.join(uploadDir, fileType);
    await fs.mkdir(dest, { recursive: true });
    cb(null, dest);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = config.fileUpload.allowedTypes;
  const ext = path.extname(file.originalname).toLowerCase().slice(1);

  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`File type .${ext} is not allowed. Allowed types: ${allowedTypes.join(', ')}`), false);
  }
};

// Create multer upload middleware
export const upload = multer({
  storage,
  limits: {
    fileSize: config.fileUpload.maxSize,
  },
  fileFilter,
});

// Upload single file
export const uploadSingle = (fieldName) => upload.single(fieldName);

// Upload multiple files
export const uploadMultiple = (fieldName, maxCount = 10) => upload.array(fieldName, maxCount);

// Upload fields (different field names)
export const uploadFields = (fields) => upload.fields(fields);

// Delete file
export const deleteFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    logger.info(`File deleted: ${filePath}`);
  } catch (error) {
    logger.error(`Error deleting file ${filePath}: ${error.message}`);
    throw error;
  }
};

// Get file info
export const getFileInfo = async (filePath) => {
  try {
    const stats = await fs.stat(filePath);
    return {
      size: stats.size,
      created: stats.birthtime,
      modified: stats.mtime,
      path: filePath,
    };
  } catch (error) {
    logger.error(`Error getting file info ${filePath}: ${error.message}`);
    throw error;
  }
};

export default {
  upload,
  uploadSingle,
  uploadMultiple,
  uploadFields,
  deleteFile,
  getFileInfo,
};
