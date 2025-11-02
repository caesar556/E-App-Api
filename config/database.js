/* import mongoose from 'mongoose';

const dbConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`✅ Database connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  }
};

export default dbConnection; */

import mongoose from "mongoose";

let isConnected = false;

const dbConnection = async () => {
  if (isConnected) {
    return;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    isConnected = conn.connections[0].readyState === 1;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ DB connection error:", err.message);
    throw err;
  }
};

export default dbConnection;