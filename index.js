import './config/dotenv.js';
import dbConnection from './config/database.js';
import app from './app.js';


dbConnection();


const PORT = process.env.PORT || 9001;


const server = app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
})

process.on("unhandledRejection", (err) => {
  console.log("Server Error unhandledRejection 💥 Shutting Down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});