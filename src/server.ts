import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import router from './routes/auth.routes';
import config from './config';
import { taskRouter } from '@src/routes/task.routes';

dotenv.config();

const app = express();

// Connect to DB first
connectDB();

// Middleware - CORS should come before other middleware
const allowedOrigins = [
  "https://task-management-app-frontend-16b2.vercel.app",
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  process.env.FRONTEND_URL || ""
].filter(Boolean);

// Enhanced CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, postman, server-side requests)
    if (!origin) return callback(null, true);

    // Allow all localhost origins in development
    if (process.env.NODE_ENV === 'development') {
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
    }

    // Check against allowed origins
    if (allowedOrigins.some(allowedOrigin =>
      origin === allowedOrigin ||
      allowedOrigin.includes(origin)
    )) {
      return callback(null, true);
    }

    // Origin not allowed
    console.log(`CORS blocked for origin: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  preflightContinue: false,
  optionsSuccessStatus: 204
}));

// Handle preflight requests explicitly
app.options('*', cors());

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', router);
app.use('/api/task', taskRouter);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Global error handler - CORRECTED
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      error: 'CORS Error',
      message: 'Origin not allowed',
      allowedOrigins: allowedOrigins
    });
  }

  console.error('Server Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'production' ? 'Something went wrong!' : err.message
  });
});

// 404 handler
app.use('*', (req: express.Request, res: express.Response) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The route ${req.originalUrl} does not exist`
  });
});

const PORT = config.PORT || process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Allowed origins:`, allowedOrigins);
});