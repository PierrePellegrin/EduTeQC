import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from '../src/routes/auth.routes';
import courseRoutes from '../src/routes/course.routes';
import testRoutes from '../src/routes/test.routes';
import adminRoutes from '../src/routes/admin.routes';
import packageRoutes from '../src/routes/package.routes';
import cycleRoutes from '../src/routes/cycle.routes';
import sectionRoutes from '../src/routes/section.routes';
import progressRoutes from '../src/routes/progress.routes';
import { errorHandler } from '../src/middleware/error.middleware';

dotenv.config();

export function createTestApp() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Disable logging for tests
  if (process.env.NODE_ENV !== 'test') {
    app.use((req, res, next) => {
      const start = Date.now();
      res.on('finish', () => {
        const duration = Date.now() - start;
        if (duration > 100) {
          console.log(`⚠️ SLOW: ${req.method} ${req.path} - ${duration}ms`);
        } else {
          console.log(`✅ ${req.method} ${req.path} - ${duration}ms`);
        }
      });
      next();
    });
  }

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/courses', courseRoutes);
  app.use('/api/tests', testRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/packages', packageRoutes);
  app.use('/api/progress', progressRoutes);
  app.use('/api', cycleRoutes);
  app.use('/api', sectionRoutes);

  // Health check
  app.get('/health', async (req, res) => {
    try {
      const healthStatus = {
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
      };
      
      res.json(healthStatus);
    } catch (error) {
      res.status(500).json({
        status: 'ERROR',
        timestamp: new Date().toISOString(),
        error: 'Health check failed'
      });
    }
  });

  // Error handler
  app.use(errorHandler);

  return app;
}