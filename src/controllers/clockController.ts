import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import {
  InternalServerError,
  BadRequestError,
  ConflictError,
} from "../errors/HttpErrors";

if (
  process.env.DATA_BASE === undefined ||
  process.env.DATA_BASE !== "firebase"
) {
  throw new Error(
    "DATA_BASE environment variable is not defined or is not set to 'firebase'"
  );
}

import ClockService from "../service/ClockService";
const clockService = new ClockService(process.env.DATA_BASE);
import TimesheetService from "../service/TimesheetService";
import { isValidDate } from "../utils/dateHelperFunctions";
import Timesheet from "../models/timesheets/types/Timesheet";
const timesheetService = new TimesheetService(process.env.DATA_BASE);

// Validar el id Ingresado, devolver usuario encontrado
export const getUserClockStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.id;
    if (!userId) {
      next(new BadRequestError("Must enter a User Id"));
      return;
    } else {
      const userClockStatus = await clockService.getStatusByUserId(userId);
      res.send(userClockStatus);
    }
  } catch (error: unknown) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new InternalServerError());
    }
  }
};

//validar si existe usuario con userId, validar si esta clockOut, almacenar en timesheet el historial de acciones
export const clockStatusChange = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.body.userId;
    const dateTime = req.body.dateTime;
    const pathSections = req.url.split("/");
    const action = pathSections[pathSections.length - 1];
    if (!userId) {
      next(new BadRequestError("Must enter a User Id"));
      return;
    }
    if (!isValidDate(dateTime)) {
      next(new BadRequestError("Must enter a valid date in ISO format"));
      return;
    }
    const userClockStatus = await clockService.getStatusByUserId(userId);

    switch (action) {
      case "in":
        if (userClockStatus.clockedIn) {
          next(new ConflictError("This user is already clocked in"));
          return;
        }
        const timesheetToAdd: Timesheet = {
          userId,
          startDate: dateTime,
          expectedHours: null,
          endDate: null,
          breaks: [],
          actionHistory: [{ actionType: "checkIn", timeStamp: dateTime }],
          workedHours: null,
          approved: false,
          rejected: false,
        };
        const newTimesheet = await timesheetService.createTimesheet(
          timesheetToAdd
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
        if (
          !userClockStatus.clockedIn ||
          userClockStatus.currentTimesheetId === null
        ) {
          next(new ConflictError("This user is not clocked in"));
          return;
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
        if (
          !userClockStatus.clockedIn ||
          userClockStatus.currentTimesheetId === null
        ) {
          next(new ConflictError("This user is not clocked in"));
          return;
        }
        if (userClockStatus.onBreak) {
          next(new ConflictError("This user is already on Break"));
          return;
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
        if (
          !userClockStatus.clockedIn ||
          userClockStatus.currentTimesheetId === null
        ) {
          next(new ConflictError("This user is not clocked in"));
          return;
        }
        if (!userClockStatus.onBreak) {
          next(new ConflictError("This user is not on Break"));
          return;
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
        next(
          new BadRequestError(
            "Invalid route for changing clock status, valid routes are: in, out, breakStart, breakEnd"
          )
        );
        break;
    }
  } catch (error: unknown) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new InternalServerError());
    }
  }
};
