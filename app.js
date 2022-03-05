import express from "express";
import http from "http";
import morgan from "morgan";
import cors from "cors";
import connectDB from "./src/config/db.config.js";
import MongoStore from "connect-mongo";
import expsession from "express-session";
import passport from "passport";
import methodOverride from "method-override";
import connectFlash from "connect-flash";
import * as envConfigs from "./src/config/env.config.js";
import {
  isOperationalError,
  logError,
  logErrorMiddleware,
  return404,
  returnError,
} from "./src/middleware/errorHandler.js";
import passportConfig from "./src/config/passport.config.js";
import MainRoutes from "./src/routes/index.routes.js";
import SockerApp from "./src/socker/index.socker.js";
import socketServer from "./src/config/socket.config.js";

import consoleLog from "./src/utils/consoleLog.js";
import { STATIC_FOLDER, UPLOADS_FOLDER } from "./src/utils/constants.js";

envConfigs.dotenvConfig;

passportConfig();
connectDB();

const app = express();
const server = http.createServer(app);

// socket server
const io = socketServer(server);
global.io = io;

// Store Session
const store = MongoStore.create({
  mongoUrl: envConfigs.MONGO_URI,
});

// express session config
const session = expsession({
  secret: envConfigs.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: store,
});

app.set("view engine", "ejs");
app.set("views", "src/views");

// Body Parse
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Cors
app.use(cors());

// Method override
app.use(methodOverride("_method"));
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);

// Session
app.use(session);

SockerApp(io);

// Flash
app.use(connectFlash());

if (envConfigs.MODE == "development") {
  app.use(morgan("dev"));
}

// Passport middleware
app.use(passport.initialize());
app.use(passport.session({}));
app.use((req, res, next) => {
  if (req.user) {
    res.locals.userAuth = req.user;
  } else {
    res.locals.userAuth = null;
  }

  next();
});

app.use((req, res, next) => {
  if (req.user) {
    res.locals.userAuth = req.user;
  } else {
    res.locals.userAuth = null;
  }

  next();
});

app.use(express.static(STATIC_FOLDER));
app.use(express.static(UPLOADS_FOLDER));

MainRoutes(app);

app.use(logErrorMiddleware);
app.use(return404);
app.use(returnError);

server.listen(envConfigs.PORT, () => {
  consoleLog.success(
    `[server] server running in ${envConfigs.MODE} mode on port ${envConfigs.PORT}`
  );
  if (envConfigs.MODE == "development") {
    consoleLog.success(`[server] open http://localhost:${envConfigs.PORT}/`);
  }
});

process.on("unhandledRejection", error => {
  throw error;
});

process.on("uncaughtException", error => {
  logError(error);

  if (!isOperationalError(error)) {
    process.exit(1);
  }
});
