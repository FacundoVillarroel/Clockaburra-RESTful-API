require("dotenv").config();

const express = require("express");
const passport = require("./src/config/PassportConfig");
const bodyParser = require("body-parser");

const UsersRouter = require("./src/routes/usersRoutes");
const ClockRouter = require("./src/routes/clockRoutes");
const ShiftRouter = require("./src/routes/shiftRoutes");
const TimesheetRouter = require("./src/routes/timesheetRoutes");
const AuthRouter = require("./src/routes/authRoutes");
const verifyJWT = require("./src/middlewares/verifyJWT");

const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const path = require("path");

const app = express();

// Lee el archivo de configuración de Swagger
const swaggerSpec = JSON.parse(
  fs.readFileSync(path.join(__dirname, "swagger.json"))
);

// Configura Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(passport.initialize());

app.use("/users", verifyJWT, UsersRouter);

app.use("/clock", verifyJWT, ClockRouter);

app.use("/shift", verifyJWT, ShiftRouter);

app.use("/timesheet", verifyJWT, TimesheetRouter);

app.use("/auth", AuthRouter);

app.listen(8080, () => {
  console.log("listening on port 8080");
});
