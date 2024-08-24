const express = require("express");

const timesheetController = require("../controllers/timesheetController");

const TimesheetRouter = express.Router();

//get all timesheets - get timesheets by conditions on query

TimesheetRouter.get("/", timesheetController.getTimesheets);

//approve a timesheet

TimesheetRouter.post("/approve", timesheetController.approveTimesheet);

//reject a timesheet

TimesheetRouter.post("/reject", timesheetController.rejectTimesheet);

// get a single timesheet

TimesheetRouter.get("/:timesheetId", timesheetController.getTimesheetById);

//Eliminar un Timesheet

TimesheetRouter.delete("/:id", timesheetController.deleteTimesheetById);

module.exports = TimesheetRouter;
