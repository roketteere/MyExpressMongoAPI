const connection = require("mongoose");

connection.connect("mongodb://127.0.0.1:27017/socialapiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const mongoose = connection.connection;

module.exports = { mongoose };
