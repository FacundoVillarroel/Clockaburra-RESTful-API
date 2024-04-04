const express = require("express");

const TimesheetRouter = express.Router();

//get all shifts

TimesheetRouter.get("/", (req, res, next) => {});

//approve a timesheet

TimesheetRouter.put("/approve/:id", (req, res, next) => {});

//reject a timesheet

TimesheetRouter.get("/reject/:id", (req, res, next) => {});

module.exports = TimesheetRouter;
