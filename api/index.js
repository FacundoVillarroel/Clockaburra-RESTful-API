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

// Static files
const staticPath = path.join(__dirname, "..", "public");
console.log("Static path: ", staticPath);
app.use("/public", express.static(staticPath));

// bodyParser is used in the following middleware.
app.use(jsonErrorHandler);

app.use(passport.initialize());

app.get("/", (req, res) => {
  res.redirect("/api-docs");
});

app.get("/api-docs", (req, res) => {
  res.sendFile(path.join(staticPath, "api-docs.html"));
});

app.use("/users", verifyJWT, UsersRouter);

app.use("/clock", verifyJWT, ClockRouter);

app.use("/shift", verifyJWT, ShiftRouter);

app.use("/timesheet", verifyJWT, TimesheetRouter);

app.use("/auth", AuthRouter);

app.use("/department", verifyJWT, DepartmentsRouter);

app.use("/role", verifyJWT, RolesRouter);

app.use("/images", verifyJWT, ImagesRouter);

module.exports = app;
