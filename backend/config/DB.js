const mongoose = require('mongoose');

const connectDatabase = () => {
  mongoose.connect(process.env.MONGO_LOCAL_URI, {}).then((con) => {
    console.log(
      `MongoDB Database connected with IP: ${con.connection.host}:${con.connection.port}`
    );
  });
};

module.exports = connectDatabase;
