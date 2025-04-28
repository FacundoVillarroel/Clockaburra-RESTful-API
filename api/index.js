require("dotenv").config();

const express = require("express");
const path = require("path");
const passport = require("../src/config/PassportConfig");
const jsonErrorHandler = require("../src/middlewares/jsonErrorHandler");

const UsersRouter = require("../src/routes/usersRoutes");
const ClockRouter = require("../src/routes/clockRoutes");
const ShiftRouter = require("../src/routes/shiftRoutes");
const TimesheetRouter = require("../src/routes/timesheetRoutes");
const AuthRouter = require("../src/routes/authRoutes");
const DepartmentsRouter = require("../src/routes/departmentsRoutes");
const RolesRouter = require("../src/routes/rolesRoutes");
const ImagesRouter = require("../src/routes/imagesRoutes");
const verifyJWT = require("../src/middlewares/verifyJWT");

const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const isProduction = process.env.NODE_ENV === "production";

const swaggerDocumentPath = isProduction
  ? path.join(__dirname, "public", "openapi", "openapi.yaml") // in production
  : path.join(__dirname, "..", "public", "openapi", "openapi.yaml"); // in develpoment

const swaggerDocument = YAML.load(swaggerDocumentPath);

const app = express();

// Middleware for CORS handling
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://clockaburra-web.vercel.app"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Middleware for Swagger documentation serving base in enviroment variable
const baseUrl = isProduction
  ? "https://clockaburra-restful-api.vercel.app/"
  : "http://localhost:8080";
swaggerDocument.servers[0].url = baseUrl;
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Middleware for static files serving
app.use("/openapi", express.static(path.join(__dirname, "../public/openapi")));

// bodyParser is used in the following middleware.
app.use(jsonErrorHandler);

app.use(passport.initialize());

app.use("/users", verifyJWT, UsersRouter);

app.use("/clock", verifyJWT, ClockRouter);

app.use("/shift", verifyJWT, ShiftRouter);

app.use("/timesheet", verifyJWT, TimesheetRouter);

app.use("/auth", AuthRouter);

app.use("/department", verifyJWT, DepartmentsRouter);

app.use("/role", verifyJWT, RolesRouter);

app.use("/images", verifyJWT, ImagesRouter);

module.exports = app;
