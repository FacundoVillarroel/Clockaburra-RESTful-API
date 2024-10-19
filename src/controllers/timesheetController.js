const TimesheetService = require("../service/TimesheetService");
const {
  createTimesheetActionHistory,
} = require("../utils/createTimesheetActionHistory");
const { calculateWorkedHours } = require("../utils/dateHelperFunctions");
const timesheetService = new TimesheetService(process.env.DATA_BASE);

exports.getTimesheets = async (req, res, next) => {
  try {
    const userIds = req.query.userIds?.split(",") || []; //may be undefined or []
    const startDate = req.query.startDate; // shouldn't be undefined
    const endDate = req.query.endDate; // shouldn't be undefined
    filters = { userIds, startDate, endDate };
    const timesheet = await timesheetService.getTimesheets(filters);
    res.send(timesheet);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.getUserTimesheets = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const timesheets = await timesheetService.getTimesheetsByUser(
      userId,
      startDate,
      endDate
    );
    res.send(timesheets);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.getTimesheetById = async (req, res, next) => {
  try {
    const timesheetId = req.params.timesheetId;
    const timesheet = await timesheetService.getTimesheetById(timesheetId);
    res.send(timesheet);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.postNewTimesheet = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const breaks = req.body.breaks; //[{breakStart:"2024-08-26T13:00:00.000+08:00",breakEnd:"2024-08-26T13:30:00.000+08:00"}] || []
    const actionHistory = createTimesheetActionHistory(
      startDate,
      breaks,
      endDate
    );
    const workedHours = calculateWorkedHours(startDate, endDate, breaks);
    const response = await timesheetService.createTimesheet(
      userId,
      startDate,
      null,
      endDate,
      breaks,
      actionHistory,
      workedHours
    );
    res.status(201).json({
      message: "timesheet created successfully",
      ...response,
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.updateTimesheet = async (req, res, next) => {
  try {
    const timesheetId = req.params.timesheetId;
    const timesheetUpdate = req.body;
    const { startDate, breaks, endDate } = timesheetUpdate;
    timesheetUpdate.actionHistory = createTimesheetActionHistory(
      startDate,
      breaks,
      endDate
    );
    timesheetUpdate.workedHours = calculateWorkedHours(
      startDate,
      endDate,
      breaks
    );
    const response = await timesheetService.updateAndApproveById(
      timesheetUpdate,
      timesheetId
    );
    res.status(201).json({
      message: "Timesheet updated & approved successfully",
      ...response,
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.approveTimesheet = async (req, res, next) => {
  try {
    const id = req.body.id;
    await timesheetService.changeTimesheetStatus(id, "approve");
    res.send({ message: "timesheet approved successfully", updated: true });
  } catch (error) {
    res.status(400).send({ message: error.message, updated: false });
  }
};

exports.rejectTimesheet = async (req, res, next) => {
  try {
    const id = req.body.id;
    await timesheetService.changeTimesheetStatus(id, "reject");
    res.send({ message: "timesheet rejected succesfully", updated: true });
  } catch (error) {
    res.status(400).send({ message: error.message, updated: false });
  }
};

exports.deleteTimesheetById = async (req, res, next) => {
  try {
    const id = req.params.id;
    await timesheetService.deleteTimesheetById(id);
    res.send({ message: "Timesheet deletede successfully", deleted: true });
  } catch (error) {
    res.status(400).send({ message: error.message, deleted: false });
  }
};
