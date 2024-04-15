const express = require("express");

const timesheetController = require("../controllers/timesheetController");

const TimesheetRouter = express.Router();

//get all timesheets

TimesheetRouter.get("/", timesheetController.getAllTimesheet);

//get all timesheets from an single user

TimesheetRouter.get("/user/:userId", timesheetController.getUserTimesheets);

//approve a timesheet

TimesheetRouter.post("/approve", timesheetController.approveTimesheet);

//reject a timesheet

TimesheetRouter.post("/reject", timesheetController.rejectTimesheet);

// get a single timesheet

TimesheetRouter.get("/:timesheetId", timesheetController.getTimesheetById);

module.exports = TimesheetRouter;
