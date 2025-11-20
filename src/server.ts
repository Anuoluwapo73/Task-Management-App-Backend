import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import authRouter from './routes/auth.routes';
import { taskRouter } from './routes/task.routes';
import config from './config';

dotenv.config();

const app = express();

// Connect DB
connectDB();

// ======== DYNAMIC CORS CONFIG (WORKS ON RENDER) ==========
app.use(cors({
  origin: "https://task-management-app-frontend-vqtn.onrender.com",
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization", "x-retry-count"]
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, x-retry-count");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});

const PORT = config.PORT || process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
