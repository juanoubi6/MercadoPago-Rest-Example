const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cluster = require("express-cluster");
const helmet = require("helmet");

const config = require("./app/config/config");
const clusterConfig = require("./app/config/cluster");
const helmetConfig = require("./app/config/helmet");

// const corsMiddle = require("./app/middle/cors");
const limitMiddle = require("./app/middle/limit");
const responseMiddle = require("./app/middle/response");
const errorMiddle = require("./app/middle/error");

const routes = require("./app/routes");

const app = express();

cluster(clusterConfig, start);

function start(worker) {

  const server = app.listen(config.PORT, () => {
    console.log(`Worker ${worker.process.pid} running on port ${server.address().port}`);
  });

  app.disable('x-powered-by');
  app.enable('trust proxy');

  app.use(responseMiddle);

  // app.use(corsMiddle);
  app.use(helmet(helmetConfig));
  app.use(limitMiddle);
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(express.static(path.join(__dirname, '/public')));

  routes(app);

  app.use(errorMiddle);

}


module.exports = app;
