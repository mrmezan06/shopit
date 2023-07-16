const app = require('./app');
const dotenv = require('dotenv');

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
