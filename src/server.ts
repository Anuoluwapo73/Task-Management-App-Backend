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
app.use(cors({
  origin: "https://task-management-app-frontend-16b2.vercel.app",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  credentials: true,
  optionsSuccessStatus: 204
}));

// Handle preflight requests explicitly
app.options('/*', cors());

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

const PORT = config.PORT || process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);

});