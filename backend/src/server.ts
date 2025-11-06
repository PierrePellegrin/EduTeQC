import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import courseRoutes from './routes/course.routes';
import testRoutes from './routes/test.routes';
import adminRoutes from './routes/admin.routes';
import packageRoutes from './routes/package.routes';
import cycleRoutes from './routes/cycle.routes';
import sectionRoutes from './routes/section.routes';
import progressRoutes from './routes/progress.routes';
import clientRoutes from './routes/client.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (performance monitoring)
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 100) {
      console.log(`âš ï¸ SLOW: ${req.method} ${req.path} - ${duration}ms`);
    } else {
      console.log(`âœ… ${req.method} ${req.path} - ${duration}ms`);
    }
  });
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/tests', testRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/packages', packageRoutes);
app.use('/api/progress', progressRoutes); // Specific prefix to avoid auth conflicts
app.use('/api/client', clientRoutes);
app.use('/api', cycleRoutes);
app.use('/api', sectionRoutes);

// Railway health check - exactly what Railway expects
app.get('/', (req, res) => {
  console.log('[ROOT] Railway health check called');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('OK');
});

// Alternative health endpoints
app.get('/ping', (req, res) => {
  console.log('[HEALTH] /ping endpoint called');
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('OK');
});

app.get('/health', (req, res) => {
  console.log('[HEALTH] /health endpoint called');
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end('{"status":"OK"}');
});

// Detailed health check
app.get('/health/detailed', async (req, res) => {
  try {
    console.log('[HEALTH] /health/detailed endpoint called');
    // Test basic server health
    const healthStatus: any = {
      status: 'OK',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: 'unknown'
    };
    
    // Test database connection
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      await prisma.$queryRaw`SELECT 1`;
      healthStatus.database = 'connected';
      await prisma.$disconnect();
    } catch (dbError) {
      console.warn('Database health check failed:', dbError);
      healthStatus.database = 'disconnected';
      healthStatus.warning = 'Database not accessible';
    }
    
    res.status(200).json(healthStatus);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      status: 'ERROR',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    });
  }
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 EDUTEQC BACKEND STARTING');
  console.log('='.repeat(50));
  console.log(`📍 Server running on port ${PORT}`);
  console.log(`🏠 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health endpoints:`);
  console.log(`   • /ping (ultra-simple)`);
  console.log(`   • /health (basic)`);
  console.log(`   • /health/detailed (with DB check)`);
  console.log(`💾 Database: ${process.env.DATABASE_URL ? 'URL configured' : 'NO DATABASE_URL'}`);
  console.log(`🌐 CORS: ${process.env.CORS_ORIGIN || 'default (*)'}`);
  console.log(`🔑 JWT Secret: ${process.env.JWT_SECRET ? 'configured' : 'NOT CONFIGURED'}`);
  console.log('='.repeat(50));
  console.log('✅ SERVER READY FOR REQUESTS');
  console.log('='.repeat(50));
});

export default app;

