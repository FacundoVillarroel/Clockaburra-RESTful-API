require("dotenv").config();
const isProduction = process.env.NODE_ENV === "production";

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
const swaggerDocument = YAML.load(
  path.join(__dirname, "../public/openapi/openapi.yaml")
);

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
// Middleware for static files serving
if (isProduction) {
  app.use(
    "/openapi",
    express.static(path.join(__dirname, "public", "openapi"))
  );
} else {
  app.use(
    "/openapi",
    express.static(path.join(__dirname, "..", "public", "openapi"))
  );
}

// Middleware for Swagger documentation serving base in enviroment variable
app.get("/api-docs", (req, res) => {
  isProduction
    ? res.sendFile(path.join(__dirname, "public", "api-docs.html"))
    : res.sendFile(path.join(__dirname, "..", "public", "api-docs.html"));
});

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
