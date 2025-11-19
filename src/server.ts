import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import authRouter from './routes/auth.routes.js';
import { taskRouter } from './routes/task.routes.js';
import config from './config/index.js';

dotenv.config();

const app = express();

// Connect DB
connectDB();

// ======== CORS CONFIG (WORKING ON RENDER + VERCEL) ==========
const allowedOrigin = "https://task-management-app-frontend-16b2.vercel.app";

app.use(cors({
  origin: allowedOrigin,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));

// Handle preflight
app.options('*', cors({
  origin: allowedOrigin,
  credentials: true
}));

// ============================================================

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api/task', taskRouter);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

const PORT = config.PORT || process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
