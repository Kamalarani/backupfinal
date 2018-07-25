/*
 ** Get all the environment variables
 ** The PORT env variable is not set in docker so
 ** defaults to 3000
 */
const PORT = process.env.PORT || 3000;

/*
 ** Get all the required libraries
 */
const debug = require("debug")("evolvus-swe:server");
const http = require("http");
const terminus = require("@godaddy/terminus");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const hbs = require("hbs");
const helmet = require("helmet");
const db = require("./db");
const _ = require("lodash");
const shortid = require("shortid");

const LIMIT = process.env.LIMIT || 10;
const tenantHeader = "X-TENANT-ID";
const userHeader = "X-USER";
const ipHeader = "X-IP-HEADER";
const PAGE_SIZE = 10;

var connection = db.connect("swe");

const hbsViewEngine = hbs.__express;
const app = express();
const router = express.Router();

hbs.registerPartials(path.join(__dirname, "views", "partials"), (err) => {
  if (err) {
    debug("error registering partials: ", err);
  } else {
    debug("registering hbs partials");
  }
});

hbs.registerHelper("if_eq", function(a, b, opts) {
  if (a == b)
    return opts.fn(this);
  else
    return opts.inverse(this);
});

hbs.registerHelper("ternary", function(index, yes, no) {
  var res = false;
  if (index % 2 == 0) {
    res = true;
  }
  return res ? yes : no;
});

// with this setting we expect the correct client hostname to be in the
// header X-Forwarded-Host and we get this value from req.hostname and
// req.ip(s) will give the value of the client ip(s) (X-Forwarded-For)
app.set("trust proxy", true);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");

app.use(helmet());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({
  limit: "2mb",
  extended: false
}));

app.use(bodyParser.json({
  limit: "2mb"
}));

app.use(function(req, res, next) {

  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "*");

  // Request methods you wish to allow
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT");

  // Request headers you wish to allow
  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With,content-type");

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  const tenantId = req.header(tenantHeader);
  const createdBy = req.header(userHeader);
  const ipAddress = req.ip;

  req.body = _.merge(req.body, {
    "tenantId": tenantId,
    "createdBy": createdBy,
    "ipAddress": ipAddress
  });

  // Pass to next layer of middleware
  next();
});

app.use(function(err, req, res, next) {
  let reference = shortid.generate();
  debug("Reference %s, Unexpected exception in save %o", reference, JSON.stringify(err));
  const response = {
    "status": "500",
    "description": "Unexpected error encountered. Server unable to process request. Please contact server administrator.",
    "data": reference
  };
  res.status(500)
    .json(response);
});
app.engine("html", hbsViewEngine);


require("./routes/main")(router);
app.use("/api/", router);

/*
 * Healthcheck and gracefull shutdown..
 */
function onSignal() {
  console.log("server is starting cleanup");
  // start cleanup of resource, like databases or file descriptors
  db.disconnect();
}

function onHealthCheck() {
  // checks if the system is healthy, like the db connection is live
  // resolves, if health, rejects if not
  return new Promise((resolve, reject) => {
    debug("0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting, Connection ready state: " + connection.readyState);
    if (connection.readyState == 1) {
      resolve("All is good, Connection status is: " + connection.readyState);
    } else {
      reject("Not so good, Connection status is: " + connection.readyState);
    }
  });
}

const server = http.createServer(app);

terminus(server, {
  signal: "SIGINT",
  healthChecks: {
    "/api/healthcheck": onHealthCheck,
  },
  onSignal
});

/*
 ** Finally start the server
 */
server.listen(PORT, () => {
  debug("server started: ", PORT);
  app.emit("application_started");
});

module.exports.app = app;
