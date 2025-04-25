require('dotenv').config();

const express = require('express');
const app = express();

// Basic middleware
app.use(express.json());

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

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/freestyle_app';

console.log('Starting server with configuration:');
console.log(`- PORT: ${PORT}`);
console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`- MONGODB_URI: ${MONGODB_URI.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://[username]:[password]@')}`);

// Start server first with minimal setup
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Test endpoint available at: http://localhost:${PORT}/test`);
  
  // Initialize the rest of the application after server is running
  initializeApp().catch(err => {
    console.error('Failed to initialize app:', err);
    // Keep server running even if initialization fails
  });
});

async function initializeApp() {
  const mongoose = require('mongoose');
  const cors = require('cors');
  const path = require('path');
  
  // Configure CORS
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));

  app.use(express.urlencoded({ extended: true }));

  // Create uploads directory
  const fs = require('fs');
  const uploadsDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
  }

  // Serve uploaded files
  app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

  // Connect to MongoDB with detailed error handling
  console.log('Attempting to connect to MongoDB...');
  
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      w: 'majority'
    });
    
    console.log('MongoDB connection successful!');
    console.log('Database name:', mongoose.connection.name);
    console.log('MongoDB version:', await mongoose.connection.db.admin().serverInfo().then(info => info.version));
    
    // Load routes only after DB connection
    const eventRoutes = require('./routes/events');
    const tablaRouter = require('./routes/tabla');
    const playerRouter = require('./routes/players');
    const knockoutRouter = require('./routes/knockout');

    // Setup routes
    app.use('/api/events', eventRoutes);
    app.use('/api/tabla', tablaRouter);
    app.use('/api/players', playerRouter);
    app.use('/api/knockout', knockoutRouter);

    // Update test route with detailed status
    app.get('/test', (req, res) => {
      console.log('Detailed test endpoint hit!');
      res.json({ 
        status: 'ok',
        message: 'Server is fully initialized!',
        environment: process.env.NODE_ENV || 'development',
        timestamp: new Date().toISOString(),
        database: {
          status: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
          name: mongoose.connection.name,
          host: mongoose.connection.host,
          port: mongoose.connection.port
        },
        server: {
          uptime: process.uptime(),
          nodeVersion: process.version,
          platform: process.platform
        }
      });
    });

  } catch (error) {
    console.error('MongoDB connection error details:');
    console.error('- Error name:', error.name);
    console.error('- Error message:', error.message);
    console.error('- Error code:', error.code);
    console.error('- Full error:', error);
    
    // Update test route with error status
    app.get('/test', (req, res) => {
      res.json({ 
        status: 'partial',
        message: 'Server is running but database connection failed',
        error: process.env.NODE_ENV === 'development' ? error.message : 'Database connection error',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      });
    });
  }

  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error('Global error handler caught:', err);
    res.status(500).json({ 
      message: 'Something went wrong!',
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  });
}

// Handle process termination
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    if (mongoose) {
      mongoose.connection.close(false, () => {
        console.log('MongoDB connection closed');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  console.log('Server will continue running after uncaught exception');
}); 