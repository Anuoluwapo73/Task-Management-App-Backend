import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import router from './routes/auth.routes';
import config from './config';
import { taskRouter } from '@src/routes/task.routes';

dotenv.config();

const app = express();

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure CORS to allow both local development and production
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5174",
  "https://task-management-app-frontend-16b2.vercel.app",
  process.env.FRONTEND_URL || ""
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // In development, allow all localhost origins
    if (origin && origin.startsWith('http://localhost')) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}))

//connect to db
connectDB();

//base route
app.use('/api/auth', router);
app.use('/api/task', taskRouter);

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
