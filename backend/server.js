const app = require('./app');
const dotenv = require('dotenv');
dotenv.config();

// Connect to database
const connectDatabase = require('./config/DB');
connectDatabase();

app.listen(process.env.PORT, () =>
  console.log(
    `Listening on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`
  )
);
