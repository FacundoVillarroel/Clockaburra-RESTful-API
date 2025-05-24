import express from "express";

import * as timesheetController from "../controllers/timesheetController";

const TimesheetRouter = express.Router();

//get all timesheets - get timesheets by conditions on query

TimesheetRouter.get("/", timesheetController.getTimesheets);

//post to new timesheet

TimesheetRouter.post("/", timesheetController.postNewTimesheet);

//update and approve timesheet by ID

TimesheetRouter.put("/:timesheetId", timesheetController.updateTimesheet);

//approve to timesheet

TimesheetRouter.post("/approve", timesheetController.approveTimesheet);

//reject to timesheet

TimesheetRouter.post("/reject", timesheetController.rejectTimesheet);

// get to single timesheet

TimesheetRouter.get("/:timesheetId", timesheetController.getTimesheetById);

//Delete a Timesheet

TimesheetRouter.delete("/:id", timesheetController.deleteTimesheetById);

export default TimesheetRouter;
