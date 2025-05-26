import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { BadRequestError, InternalServerError } from "../errors/HttpErrors";

if (
  process.env.DATA_BASE === undefined ||
  process.env.DATA_BASE !== "firebase"
) {
  throw new Error(
    "DATA_BASE environment variable is not defined or is not set to 'firebase'"
  );
}

import ShiftService from "../service/ShiftService";
import type Shift from "../models/shifts/types/Shift";
const shiftService = new ShiftService(process.env.DATA_BASE);

import { calculateWorkedHours } from "../utils/dateHelperFunctions";

export const getShifts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userIdsQuery = req.query.userIds;
    const userIds =
      typeof userIdsQuery === "string"
        ? userIdsQuery.split(",")
        : Array.isArray(userIdsQuery)
        ? userIdsQuery.flatMap((userId) =>
            typeof userId === "string" ? userId.split(",") : []
          )
        : [];

    const startDateRaw = req.query.startDate;
    const endDateRaw = req.query.endDate;

    const startDate = typeof startDateRaw === "string" ? startDateRaw : null;
    const endDate = typeof endDateRaw === "string" ? endDateRaw : null;
    const filters = { userIds, startDate, endDate };
    const shifts = await shiftService.getShifts(filters);
    res.send(shifts);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new InternalServerError());
    }
  }
};

export const getShiftByUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = req.params.userId;
    const startDateRaw = req.query.startDate;
    const endDateRaw = req.query.endDate;

    const startDate = typeof startDateRaw === "string" ? startDateRaw : null;
    const endDate = typeof endDateRaw === "string" ? endDateRaw : null;
    const response = await shiftService.getByUserId(userId, startDate, endDate);
    res.send(response);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new InternalServerError());
    }
  }
};

export const getShiftById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const shift = await shiftService.getShiftById(id);
    res.send(shift);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new InternalServerError());
    }
  }
};

export const postNewShift = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { userId, startDate, endDate, breaks } = req.body;
    if (typeof userId !== "string" || !userId) {
      next(new BadRequestError("userId must be a non-empty string"));
      return;
    }
    if (typeof startDate !== "string" || !startDate) {
      next(new BadRequestError("startDate must be a non-empty string"));
      return;
    }
    if (typeof endDate !== "string" || !endDate) {
      next(new BadRequestError("endDate must be a non-empty string"));
      return;
    }
    if (typeof breaks !== "object" || !Array.isArray(breaks)) {
      next(new BadRequestError("breaks must be an array"));
      return;
    }
    const totalHours = calculateWorkedHours(startDate, endDate, breaks);
    const shift: Shift = {
      userId: userId,
      startDate,
      endDate,
      breaks,
      totalHours,
    };

    const response = await shiftService.addShift(shift);
    res.status(201).send({
      message: "shift created successfully",
      ...response,
    });
  } catch (error: unknown) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new InternalServerError());
    }
  }
};

export const modifyShift = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const shiftUpdate = req.body;
    if (!Object.keys(shiftUpdate).length) {
      next(new BadRequestError("No properties to update provided"));
      return;
    } else {
      await shiftService.updateShiftById(id, shiftUpdate);
      res.send({
        message: "Shift updated successfully",
        update: true,
        updatedShift: { id: id, ...shiftUpdate },
      });
    }
  } catch (error: unknown) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new InternalServerError());
    }
  }
};

export const deleteShift = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    await shiftService.deleteShiftById(id);
    res.status(204).send({
      message: "Shift deleted successfully",
      deleted: true,
    });
  } catch (error: unknown) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new InternalServerError());
    }
  }
};
