const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Root path handler for Railway healthcheck
app.get('/', (req, res) => {
  res.redirect('/health');
});

// Create uploads directory
const fs = require('fs');
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)){
  fs.mkdirSync(uploadsDir);
}

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Load routes before MongoDB connection
const eventRoutes = require('./routes/events');
const tablaRouter = require('./routes/tabla');
const playerRouter = require('./routes/players');
const knockoutRouter = require('./routes/knockout');

// Setup routes
app.use('/api/events', eventRoutes);
app.use('/api/tabla', tablaRouter);
app.use('/api/players', playerRouter);
app.use('/api/knockout', knockoutRouter);

// Initial test route for basic healthcheck
app.get('/test', (req, res) => {
  console.log('Basic healthcheck endpoint hit!');
  res.json({ 
    status: 'ok',
    timestamp: new Date().toISOString(),
    message: 'Server is running. Database connection pending.',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check endpoint with database status
app.get('/health', async (req, res) => {
  try {
    const dbStatus = mongoose.connection.readyState;
    const dbStatusText = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    }[dbStatus] || 'unknown';

    const healthStatus = {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbStatusText,
        connected: dbStatus === 1,
        name: mongoose.connection.name,
        version: await mongoose.connection.db.admin().serverInfo().then(info => info.version).catch(() => 'unknown')
      },
      memory: {
        rss: process.memoryUsage().rss,
        heapTotal: process.memoryUsage().heapTotal,
        heapUsed: process.memoryUsage().heapUsed
      }
    };

    res.status(200).json(healthStatus);
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      message: 'Health check failed',
      error: error.message
    });
  }
});

// Add route to list all registered routes
app.get('/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach(middleware => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach(handler => {
        if (handler.route) {
          routes.push({
            path: handler.route.path,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });
  res.json(routes);
});

// Validate and parse PORT
const validatePort = (port) => {
  const parsedPort = parseInt(port, 10);
  if (isNaN(parsedPort)) {
    throw new Error(`Invalid PORT: ${port} - Must be a number`);
  }
  if (parsedPort < 0 || parsedPort > 65535) {
    throw new Error(`Invalid PORT: ${port} - Must be between 0 and 65535`);
  }
  return parsedPort;
};

// Environment variables with detailed logging
let PORT;
try {
  PORT = validatePort(process.env.PORT || 3001);
} catch (error) {
  console.error('Port validation failed:', error.message);
  console.log('Falling back to default port 3001');
  PORT = 3001;
}

// Explicitly check for MongoDB URI
if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI environment variable is not set!');
  console.error('Please set the MONGODB_URI environment variable in Railway');
  process.exit(1);
}

const MONGODB_URI = process.env.MONGODB_URI;

console.log('Starting server with configuration:');
console.log(`- PORT: ${PORT}`);
console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`- MONGODB_URI: ${MONGODB_URI.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://[username]:[password]@')}`);

// Log all environment variables (except sensitive ones)
console.log('Environment variables:');
Object.keys(process.env).forEach(key => {
  if (!key.toLowerCase().includes('password') && !key.toLowerCase().includes('secret')) {
    console.log(`- ${key}: ${process.env[key]}`);
  }
});

// Set mongoose options
mongoose.set('strictQuery', false);

// Connect to MongoDB
console.log('Attempting to connect to MongoDB...');
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  retryWrites: true,
  w: 'majority',
  maxPoolSize: 10,
  minPoolSize: 5,
  connectTimeoutMS: 10000
}).then(async () => {
  console.log('MongoDB connection successful!');
  console.log('Database name:', mongoose.connection.name);
  console.log('MongoDB version:', await mongoose.connection.db.admin().serverInfo().then(info => info.version));
}).catch((error) => {
  console.error('MongoDB connection error details:');
  console.error('- Error name:', error.name);
  console.error('- Error message:', error.message);
  console.error('- Error code:', error.code);
  console.error('- Error stack:', error.stack);
  console.error('- Full error:', error);
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Test endpoint available at: http://localhost:${PORT}/test`);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error handler caught:', err);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Handle process termination
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  console.log('Server will continue running after uncaught exception');
}); 