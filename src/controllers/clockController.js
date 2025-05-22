const ClockService = require("../service/ClockService");
const clockService = new ClockService(process.env.DATA_BASE);
const TimesheetService = require("../service/TimesheetService").default;
const { isValidDate } = require("../utils/dateHelperFunctions");
const timesheetService = new TimesheetService(process.env.DATA_BASE);

// Validar el id Ingresado, devolver usuario encontrado
exports.getUserClockStatus = async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (userId) {
      const userClockStatus = await clockService.getStatusByUserId(userId);
      res.send(userClockStatus);
    } else {
      throw new Error("Must enter a User Id");
    }
  } catch (error) {
    if (
      error.message === `User clock status not found with id: ${req.params.id}`
    ) {
      res.status(404).send({ message: error.message });
    } else {
      res.status(400).send({ message: error.message });
    }
  }
};

//validar si existe usuario con userId, validar si esta clockOut, almacenar en timesheet el historial de acciones
exports.clockStatusChange = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const dateTime = req.body.dateTime;
    const pathSections = req.url.split("/");
    const action = pathSections[pathSections.length - 1];
    if (!userId) {
      throw new Error("userId and date must be provided in request body");
    }
    if (!isValidDate(dateTime)) {
      throw new Error("there must enter a valid date in ISO format");
    }
    const userClockStatus = await clockService.getStatusByUserId(userId);

    switch (action) {
      case "in":
        if (userClockStatus.clockedIn) {
          throw new Error("This user is already clocked in");
        }
        //verificar si tenia turno y pasar expectedHours a timesheet
        const newTimesheet = await timesheetService.createTimesheet(
          userId,
          dateTime
        );
        userClockStatus.currentTimesheetId = newTimesheet.id;
        await clockService.postClockIn(userClockStatus);
        res.send({
          message: `User ${userId} clocked In`,
          updated: true,
          data: { newTimesheet },
        });
        break;

      case "out":
        if (!userClockStatus.clockedIn) {
          throw new Error("This user is not clocked in");
        }
        await timesheetService.updateTimesheetById(
          userClockStatus.currentTimesheetId,
          dateTime,
          action
        );
        if (userClockStatus.onBreak) {
          await clockService.postBreakEnd(userClockStatus);
        }
        userClockStatus.currentTimesheetId = null;
        await clockService.postClockOut(userClockStatus);
        res.send({ message: `User ${userId} clocked Out`, updated: true });
        break;

      case "breakStart":
        if (!userClockStatus.clockedIn) {
          throw new Error("This user is not clocked in");
        }
        if (userClockStatus.onBreak) {
          throw new Error("This user is currently on Break");
        }
        await timesheetService.updateTimesheetById(
          userClockStatus.currentTimesheetId,
          dateTime,
          action
        );
        await clockService.postBreakStart(userClockStatus);

        res.send({ message: `User ${userId} break started`, updated: true });
        break;

      case "breakEnd":
        if (!userClockStatus.clockedIn) {
          throw new Error("This user is not clocked in");
        }
        if (!userClockStatus.onBreak) {
          throw new Error("This user is not on break");
        }
        await timesheetService.updateTimesheetById(
          userClockStatus.currentTimesheetId,
          dateTime,
          action
        );
        await clockService.postBreakEnd(userClockStatus);
        res.send({ message: `User ${userId} break ended`, updated: true });
        break;

      default:
        throw new Error(
          "Invalid route for changing clock status, valid routes are: in, out, breakStart, breakEnd"
        );
    }
  } catch (error) {
    res.status(400).send({ message: error.message, updated: false });
  }
};
