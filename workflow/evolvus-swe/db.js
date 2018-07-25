const DBURL = process.env.MONGO_DB_URL || "mongodb://localhost:27017/Test";

/*
 ** Get all the required libraries
 */
const debug = require("debug")("evolvus-swe:db");
const mongoose = require("mongoose");


const connection = {

  "connect": function(appName) {
    let options = {
      // dont build indexes on connect.
      // for production this can take time. Index creation and maintenance
      // must be done outside, not on application connect.
      "autoIndex": false, // Default true

      // keep trying to connect when the connection fails for any reason
      "autoReconnect": true, // Default true

      "reconnectTries": Number.MAX_VALUE, // Never stop trying to reconnect
      "reconnectInterval": 1000, // Reconnect every 1000ms

      // Maintain up to 10 socket connections,
      // should ideally come from environment variables
      "poolSize": 10, // Default 5

      // If not connected, return errors immediately rather than waiting for reconnect
      // this is a mongoose feature not mongodb, this is for schema validations
      "bufferMaxEntries": 0,
      "bufferCommands": false,

      // How long the MongoDB driver will wait before failing its initial
      // connection attempt.
      // Once Mongoose has successfully connected, connectTimeoutMS is no longer relevant.
      "connectTimeoutMS": 5000,

      // How long the MongoDB driver will wait before killing an inactive socket.
      // A socket may be inactive because of either no activity or a long-running operation.
      // Should set this to 2-3x your longest running operation
      "socketTimeoutMS": 10000, // default 30000 (30 seconds)

      // For long running applications, enable keepAlive with a number of milliseconds.
      // Without it, after some period of time you may start to see "connection closed"
      // errors for what seems like no reason.
      "keepAlive": 120,

      "useNewUrlParser": true,
      "appname": appName
    };
    return mongoose.connect(DBURL, options);
  },
  "disconnect": function() {
    return mongoose.connection.close();
  }
};

mongoose.connection.on("error", (e) => {
  debug("Error getting connection:" + JSON.stringify(e));
});

mongoose.connection.on("reconnectFailed", (e) => {
  debug("Error trying re-connection:" + JSON.stringify(e));
});

mongoose.connection.on("open", () => {
  debug("Got connection");
});

mongoose.connection.on("connected", () => {
  debug("Connection connected");
});

mongoose.connection.on("disconnected", () => {
  debug("Connection disconnected");
});


module.exports = connection;
