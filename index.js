import './config/dotenv.js';
import dbConnection from './config/database.js';
import app from './app.js';

const PORT = process.env.PORT || 9001;

const startServer = async () => {
  await dbConnection();

  const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

  process.on("unhandledRejection", (err) => {
    console.log("💥 Server Error: unhandledRejection... shutting down");
    console.log(err.name, err.message);

    server.close(() => {
      process.exit(1);
    });
  });
};

startServer();