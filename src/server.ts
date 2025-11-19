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

// ======== DYNAMIC CORS CONFIG (WORKS ON RENDER + VERCEL) ==========
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (Postman, curl)
    if (!origin) return callback(null, true);

    // Allow localhost
    if (origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1")) {
      return callback(null, true);
    }

    // Allow all Vercel preview URLs for your frontend
    if (origin.startsWith("https://task-management-app-frontend-16b2")) {
      return callback(null, true);
    }

    // Block other origins
    callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  optionsSuccessStatus: 204,
  preflightContinue: false
}));
// ===================================================================

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
