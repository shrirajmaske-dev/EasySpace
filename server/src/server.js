import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

import { generalRateLimiter } from './middleware/rateLimiter.js';
import curationRoutes from './routes/curationRoutes.js';
import diagnosticRoutes from './routes/diagnosticRoutes.js';
import remediationRoutes from './routes/remediationRoutes.js';
import masteryRoutes from './routes/masteryRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// Trust proxy for Vercel and reverse proxy environments (ensures correct IP rate-limiting)
app.set('trust proxy', 1);

// Security Headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
  })
);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin) return callback(null, true);
      const allowedOrigins = [
        CLIENT_URL,
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000'
      ];
      if (
        allowedOrigins.indexOf(origin) !== -1 ||
        origin.startsWith('http://localhost:') ||
        origin.endsWith('.vercel.app')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in deployment
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-demo-mode']
  })
);

// Body Parser
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Apply general rate limiting
app.use(generalRateLimiter);

// Central API Router (compatible with both /api/v1 and serverless /v1 mounts)
const apiRouter = express.Router();

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'EasySpace Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Primary API Routes
apiRouter.use('/curate', curationRoutes);
apiRouter.use('/diagnostic', diagnosticRoutes);
apiRouter.use('/remediation', remediationRoutes);
apiRouter.use('/mastery', masteryRoutes);

// Mount API routes under /api/v1 and /v1 (for direct or rewritten serverless routing)
app.use('/api/v1', apiRouter);
app.use('/v1', apiRouter);
app.use('/api', apiRouter);

// Root health check fallback
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'EasySpace Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// 404 Route Handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`
  });
});

// Centralized Error Boundary Middleware
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]:', err);
  const status = err.status || 500;
  res.status(status).json({
    error: 'Internal Server Error',
    message: err.message || 'An unexpected server error occurred.',
    timestamp: new Date().toISOString()
  });
});

// Server Initialization (Only listen directly when not executed as a serverless function)
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(`🚀 EasySpace Backend running on http://localhost:${PORT}`);
    console.log(`📡 API V1 Base: http://localhost:${PORT}/api/v1`);
    console.log(`🛡️  Security: Helmet & Rate Limiter active`);
    console.log(`====================================================`);
  });
}

export default app;
