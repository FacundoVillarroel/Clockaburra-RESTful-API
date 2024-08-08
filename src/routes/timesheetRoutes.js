const express = require("express");

const timesheetController = require("../controllers/timesheetController");

const TimesheetRouter = express.Router();

//get all timesheets - get timesheets based in filters

TimesheetRouter.get("/", timesheetController.getAllTimesheet);

//get all timesheets from an single user - get timesheets for an user based in filters

TimesheetRouter.get("/user/:userId", timesheetController.getUserTimesheets);

//approve a timesheet

TimesheetRouter.post("/approve", timesheetController.approveTimesheet);

//reject a timesheet

TimesheetRouter.post("/reject", timesheetController.rejectTimesheet);

// get a single timesheet

TimesheetRouter.get("/:timesheetId", timesheetController.getTimesheetById);

//Eliminar un Timesheet

TimesheetRouter.delete("/:id", timesheetController.deleteTimesheetById);

module.exports = TimesheetRouter;
