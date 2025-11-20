import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import sequelize, { testConnection, syncDatabase } from './config/database';
import { initializeModels } from './models';

// Routes
import authRoutes from './routes/auth';
import profileRoutes from './routes/profile';
import medicalRecordRoutes from './routes/medicalRecords';
import appointmentRoutes from './routes/appointments';
import documentRoutes from './routes/documents';
import petRoutes from './routes/pets';
import bodyScanRoutes from './routes/bodyScans';
import healthMetricsRoutes from './routes/healthMetrics';

// Load environment variables
dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS Configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate Limiting for HIPAA Compliance
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Request Logging for HIPAA Audit
app.use((req: Request, res: Response, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Health Check
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV
  });
});

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/profile', profileRoutes);
app.use('/api/v1/medical-records', medicalRecordRoutes);
app.use('/api/v1/appointments', appointmentRoutes);
app.use('/api/v1/documents', documentRoutes);
app.use('/api/v1/pets', petRoutes);
app.use('/api/v1/body-scans', bodyScanRoutes);
app.use('/api/v1/health-metrics', healthMetricsRoutes);

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// 404 Handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Error Handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Initialize Database and Start Server
const startServer = async () => {
  try {
    // Test database connection
    await testConnection();

    // Initialize models
    await initializeModels();

    // Sync database (in development only)
    if (process.env.NODE_ENV === 'development') {
      await syncDatabase(false);
    }

    // Start server
    app.listen(PORT, () => {
      console.log('=================================');
      console.log(`🚀 MedTap AI Server Started`);
      console.log(`📝 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 Port: ${PORT}`);
      console.log(`🔒 HIPAA Compliance: ENABLED`);
      console.log(`⏰ Time: ${new Date().toISOString()}`);
      console.log('=================================');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

// Graceful Shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  await sequelize.close();
  process.exit(0);
});

// Start the server
startServer();

export default app;
