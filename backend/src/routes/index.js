import authRoutes from './authRoutes.js';
import propertyRoutes from './propertyRoutes.js';
import listingRoutes from './listingRoutes.js';

const setupRoutes = (app, apiVersion = 'v1') => {
  // Mount routes
  app.use(`/api/${apiVersion}/auth`, authRoutes);
  app.use(`/api/${apiVersion}/properties`, propertyRoutes);
  app.use(`/api/${apiVersion}/listings`, listingRoutes);

  // Health check
  app.get(`/api/${apiVersion}/health`, (req, res) => {
    res.json({
      success: true,
      message: 'API is running',
      timestamp: new Date().toISOString(),
    });
  });

  // Root route
  app.get('/', (req, res) => {
    res.json({
      success: true,
      message: 'Welcome to Lanfriq API',
      version: apiVersion,
      documentation: `/api/${apiVersion}/docs`,
    });
  });
};

export default setupRoutes;
