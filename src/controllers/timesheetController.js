const TimesheetService = require("../service/TimesheetService");
const timesheetService = new TimesheetService(process.env.DATA_BASE);

exports.getAllTimesheet = async (req, res, next) => {
  try {
    const timesheets = await timesheetService.getAllTimesheets();
    res.send(timesheets);
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

exports.approveTimesheet = async (req, res, next) => {
  try {
    const id = req.body.id;
    await timesheetService.changeTimesheetStatus(id, "approve");
    res.send({ message: "timesheet approved:", updated: true });
  } catch (error) {
    res.status(400).send({ message: error.message, updated: false });
  }
};

exports.rejectTimesheet = async (req, res, next) => {
  try {
    const id = req.body.id;
    await timesheetService.changeTimesheetStatus(id, "reject");
    res.send({ message: "timesheet rejected:", updated: true });
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
