import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/aethertalk');
    console.log(`[MongoDB Connected] Host: ${conn.connection.host}`);
  } catch (error) {
    console.error(`[MongoDB Connection Error] ${error.message}`);
    console.warn(`[Warning] Database operations will fail. Check if MongoDB is running.`);
    // Don't kill server immediately, let it run in mock capability or catch errors dynamically
  }
};

export default connectDB;
