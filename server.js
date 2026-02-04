const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

const app = express();

// ============================================
// MIDDLEWARE SETUP
// ============================================

// CORS configuration
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:5173',
    'http://localhost:3000/admin',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

// Body parser middleware
app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`\n[${timestamp}] ${req.method} ${req.path}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log('📦 Body:', JSON.stringify(req.body).substring(0, 300));
  }
  next();
});

// ============================================
// DATABASE CONNECTION
// ============================================

console.log('\n🔍 Environment Check:');
console.log('✓ CORS enabled for:', corsOptions.origin);
console.log('✓ MongoDB URI:', process.env.MONGO_URI ? '✅ Set' : '❌ Not set');
console.log('✓ NODE_ENV:', process.env.NODE_ENV || 'development');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('\n✅ MongoDB connected successfully'))
  .catch(err => {
    console.error('\n❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// ============================================
// API ROUTES
// ============================================

// Import routes
const jobRoutes = require('./routes/jobs');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');
const applicationRoutes = require('./routes/applications');
const interviewRoutes = require('./routes/interviews');
const offerRoutes = require('./routes/offers');

// Mount routes
app.use('/api/jobs', jobRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/offers', offerRoutes);

// ============================================
// HEALTH CHECK & ROOT ROUTES
// ============================================

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'development'
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'BootWay HR Backend API',
    version: '1.0.0',
    documentation: '/api/docs'
  });
});

// ============================================
// 404 HANDLER
// ============================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path
  });
});

// ============================================
// ERROR HANDLING MIDDLEWARE
// ============================================

const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// ============================================
// SERVER STARTUP
// ============================================

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`\n✅ Server running on http://localhost:${PORT}`);
  console.log('🎯 API Base URL: http://localhost:' + PORT + '/api');
  console.log('📊 Health Check: http://localhost:' + PORT + '/api/health\n');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Server closed');
    mongoose.connection.close(false, () => {
      console.log('✅ MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = app;
