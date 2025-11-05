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

// Health check
app.get('/health', async (req, res) => {
  try {
    // Test basic server health
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

app.listen(PORT, () => {
  console.log(`ðŸš€ Server running on port ${PORT}`);
  console.log(`ðŸ“š Environment: ${process.env.NODE_ENV || 'development'}`);
});

export default app;

