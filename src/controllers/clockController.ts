import type { Request, Response } from "express";

if(process.env.DATA_BASE === undefined || process.env.DATA_BASE !== "firebase" ) {
  throw new Error("DATA_BASE environment variable is not defined or is not set to 'firebase'");
}

import ClockService from "../service/ClockService";
const clockService = new ClockService(process.env.DATA_BASE);
import TimesheetService from "../service/TimesheetService";
import { isValidDate } from "../utils/dateHelperFunctions";
import Timesheet from "../models/timesheets/types/Timesheet";
const timesheetService = new TimesheetService(process.env.DATA_BASE);

// Validar el id Ingresado, devolver usuario encontrado
export const getUserClockStatus = async (req:Request, res:Response) => {
  try {
    const userId = req.params.id;
    if (userId) {
      const userClockStatus = await clockService.getStatusByUserId(userId);
      res.send(userClockStatus);
    } else {
      throw new Error("Must enter a User Id");
    }
  } catch (error:any) {
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
export const clockStatusChange = async (req:Request, res:Response) => {
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
        const timesheetToAdd : Timesheet = {
          userId,
          startDate:dateTime,
          expectedHours : null,
          endDate : null,
          breaks : [],
          actionHistory : [{ actionType: "checkIn", timeStamp: dateTime }],
          workedHours : null,
          approved:false,
          rejected:false
        }
        const newTimesheet = await timesheetService.createTimesheet(timesheetToAdd);
        userClockStatus.currentTimesheetId = newTimesheet.id;
        await clockService.postClockIn(userClockStatus);
        res.send({
          message: `User ${userId} clocked In`,
          updated: true,
          data: { newTimesheet },
        });
        break;

      case "out":
        if (!userClockStatus.clockedIn || userClockStatus.currentTimesheetId === null) {
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
        if (!userClockStatus.clockedIn || userClockStatus.currentTimesheetId === null) {
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
        if (!userClockStatus.clockedIn || userClockStatus.currentTimesheetId === null) {
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
  } catch (error:any) {
    res.status(400).send({ message: error.message, updated: false });
  }
};
