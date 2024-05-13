const express = require("express");

const timesheetController = require("../controllers/timesheetController");

const TimesheetRouter = express.Router();

//get all timesheets

TimesheetRouter.get("/", timesheetController.getAllTimesheet);

//get all timesheets from an single user

TimesheetRouter.get("/user/:userId", timesheetController.getUserTimesheets);

// get timesheets from a single user for week selected

TimesheetRouter.get(
  "/user/:userId/week/:startDate",
  timesheetController.getUserTimesheets
);

// get timesheets from a single user from week selected to period of time selected

TimesheetRouter.get(
  "/user/:userId/week/:startDate/:endDate",
  timesheetController.getUserTimesheets
);

//approve a timesheet

TimesheetRouter.post("/approve", timesheetController.approveTimesheet);

//reject a timesheet

TimesheetRouter.post("/reject", timesheetController.rejectTimesheet);

// get a single timesheet

TimesheetRouter.get("/:timesheetId", timesheetController.getTimesheetById);

//Eliminar un Timesheet

TimesheetRouter.delete("/:id", timesheetController.deleteTimesheetById);

module.exports = TimesheetRouter;
