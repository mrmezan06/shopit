const app = require('./app');
const dotenv = require('dotenv');

const cloudinary = require('cloudinary');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log('Shutting down the server due to uncaught exception.');
  process.exit(1);
});

dotenv.config();

// Generate uncaught exception
// console.log(s);

// Connect to database
const connectDatabase = require('./config/DB');
connectDatabase();

// Connect to cloudinary

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = app.listen(process.env.PORT, () =>
  console.log(
    `Listening on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  )
);

// Handle unhandled promise rejections like mongoose uri string mistake
process.on('unhandledRejection', (err) => {
  console.log(`ERROR: ${err.message}`);
  console.log('Shutting down the server due to unhandled promise rejection.');
  server.close(() => {
    process.exit(1);
  });
});
