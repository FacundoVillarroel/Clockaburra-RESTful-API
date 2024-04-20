require("dotenv").config();

const express = require("express");
const session = require("express-session");
const passport = require("./src/config/PassportConfig");
const bodyParser = require("body-parser");

const UsersRouter = require("./src/routes/usersRoutes");
const ClockRouter = require("./src/routes/clockRoutes");
const ShiftRouter = require("./src/routes/shiftRoutes");
const TimesheetRouter = require("./src/routes/timesheetRoutes");
const AuthRouter = require("./src/routes/authRoutes");

const app = express();

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

app.use(
  session({
    secret: process.env.SESION_SECRET,
    resave: true,
    rolling: true,
    cookie: {
      maxAge: 600000,
    },
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/users", UsersRouter);

app.use("/clock", ClockRouter);

app.use("/shift", ShiftRouter);

app.use("/timesheet", TimesheetRouter);

app.use("/auth", AuthRouter);

app.listen(8080, () => {
  console.log("listening on port 8080");
});
