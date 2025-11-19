import mongoose from 'mongoose';
import dotenv from 'dotenv';
import config from '.';
dotenv.config();

export const connectDB = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI || '');
    console.log(`Database successfully connected`);
  } catch (error) {
    console.log(`Error connecting to database`, error);
    process.exit(1);
  }
};
