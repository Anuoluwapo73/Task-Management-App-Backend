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

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"]
}))

//connect to db
connectDB();

//base route
app.use('/api/auth', router);
app.use('/api/task', taskRouter);

app.listen(config.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
