require("dotenv").config();

const express = require("express");
const path = require("path");
const passport = require("./src/config/PassportConfig");
const jsonErrorHandler = require("./src/middlewares/jsonErrorHandler");

const UsersRouter = require("./src/routes/usersRoutes");
const ClockRouter = require("./src/routes/clockRoutes");
const ShiftRouter = require("./src/routes/shiftRoutes");
const TimesheetRouter = require("./src/routes/timesheetRoutes");
const AuthRouter = require("./src/routes/authRoutes");
const DepartmentsRouter = require("./src/routes/departmentsRoutes");
const RolesRouter = require("./src/routes/rolesRoutes");
const verifyJWT = require("./src/middlewares/verifyJWT");

/* const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const path = require("path"); */
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./openapi.yaml");

const app = express();

// Lee el archivo de configuración de Swagger
/* const swaggerSpec = JSON.parse(
  fs.readFileSync(path.join(__dirname, "swagger.json"))
); */

// Configura Swagger UI
/* app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec)); */
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/openapi", express.static(path.join(__dirname, "public", "openapi")));

// bodyParser is used in the next middleware.
app.use(jsonErrorHandler);

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

app.use("/department", verifyJWT, DepartmentsRouter);

app.use("/role", verifyJWT, RolesRouter);

app.listen(8080, () => {
  console.log("listening on port 8080");
});
