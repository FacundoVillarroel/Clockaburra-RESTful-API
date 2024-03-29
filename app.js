require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const UsersRouter = require("./src/routes/users");
const ClockRouter = require("./src/routes/clock");
const ShiftRouter = require("./src/routes/shift");
const TimesheetRouter = require("./src/routes/timesheet");

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

app.use("/users", UsersRouter);

app.use("/clock", ClockRouter);

app.use("/shift", ShiftRouter);

app.use("/timesheet", TimesheetRouter);

app.listen(8080);
