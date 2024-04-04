const express = require("express");

const timesheetController = require("../controllers/timesheetController");

const TimesheetRouter = express.Router();

//get all timesheets

TimesheetRouter.get("/", timesheetController.getAllTimesheet);

//get all timesheets from an single user

TimesheetRouter.get("/:userId", timesheetController.getUserTimesheets);

// get a single timesheet

TimesheetRouter.get(
  "/:userId/:timesheetId",
  timesheetController.getTimesheetById
);

//approve a timesheet

TimesheetRouter.post("/approve/:id", timesheetController.approveTimesheet);

//reject a timesheet

TimesheetRouter.post("/reject/:id", timesheetController.rejectTimesheet);

module.exports = TimesheetRouter;
