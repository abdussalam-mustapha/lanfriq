import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';
import config from './config/index.js';
import connectDB from './config/database.js';
import setupRoutes from './routes/index.js';
import { errorHandler, notFound } from './utils/errors.js';
import logger from './utils/logger.js';
import blockchainService from './services/blockchainService.js';

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Initialize blockchain service
blockchainService.initialize().catch((err) => {
  logger.error(`Failed to initialize blockchain service: ${err.message}`);
});

// Security middleware
app.use(helmet());
app.use(mongoSanitize());

// CORS
app.use(cors(config.cors));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api', limiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (config.env === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined', {
    stream: {
      write: (message) => logger.info(message.trim()),
    },
  }));
}

// Serve static files (uploads)
app.use('/uploads', express.static('uploads'));

// Setup routes
setupRoutes(app, config.apiVersion);

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = config.port;
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running in ${config.env} mode on port ${PORT}`);
  logger.info(`📡 API available at http://localhost:${PORT}/api/${config.apiVersion}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  logger.error(`Unhandled Rejection: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.info('HTTP server closed');
    // Stop blockchain event listeners
    blockchainService.removeAllListeners();
    process.exit(0);
  });
});

export default app;
