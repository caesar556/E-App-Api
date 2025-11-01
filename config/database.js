import mongoose from 'mongoose';

const dbConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log(`✅ Database connected: ${conn.connection.host}`);
  } catch (err) {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  }
};

export default dbConnection;