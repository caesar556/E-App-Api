import express from "express";
import './config/dotenv.js';
import dbConnection from './config/database.js';
import app from './app.js';
import { webhook } from "./controllers/shop/paymentController.js";

dbConnection();

const PORT = process.env.PORT || 9001;

app.post('/api/payment/webhook', express.raw({ type: "application/json" }), webhook);

const server = app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  console.log("Server Error unhandledRejection 💥 Shutting Down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});