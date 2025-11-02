import app from "../app.js";
import dbConnection from "../config/database.js";

let isConnected = false;
async function connectDB() {
  if (!isConnected) {
    await dbConnection();
    isConnected = true;
  }
}

export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}