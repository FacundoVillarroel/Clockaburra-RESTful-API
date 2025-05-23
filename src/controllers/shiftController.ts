import type { Request, Response } from "express";

if(process.env.DATA_BASE === undefined || process.env.DATA_BASE !== "firebase" ) {
  throw new Error("DATA_BASE environment variable is not defined or is not set to 'firebase'");
}

import ShiftService from "../service/ShiftService";
import Shift from "../models/shifts/types/Shift";
const shiftService = new ShiftService(process.env.DATA_BASE);

import { calculateWorkedHours } from "../utils/dateHelperFunctions";

export const getShifts = async (req:Request, res: Response) => {
  try {
    const userIdsQuery = req.query.userIds;
    const userIds = typeof userIdsQuery === "string" 
      ? userIdsQuery.split(",")
      : Array.isArray(userIdsQuery)
        ? userIdsQuery.flatMap(userId => typeof userId === "string" ? userId.split(",") : [] )
        : [];

    const startDateRaw = req.query.startDate;
    const endDateRaw = req.query.endDate;
    
    const startDate = typeof startDateRaw === "string" ? startDateRaw : null;
    const endDate = typeof endDateRaw === "string" ? endDateRaw : null;
    const filters = { userIds, startDate, endDate };
    const shifts = await shiftService.getShifts(filters);
    res.send(shifts);
  } catch (error:any) {
    res.status(400).send({ message: error.message });
  }
};

export const getShiftByUser = async (req:Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const startDateRaw = req.query.startDate;
    const endDateRaw = req.query.endDate;
    
    const startDate = typeof startDateRaw === "string" ? startDateRaw : null;
    const endDate = typeof endDateRaw === "string" ? endDateRaw : null;
    const response = await shiftService.getByUserId(userId, startDate, endDate);
    res.send(response);
  } catch (error:any) {
    res.status(400).send({ message: error.message });
  }
};

export const getShiftById = async (req:Request, res: Response) => {
  try {
    const id = req.params.id;
    const shift = await shiftService.getShiftById(id);
    res.send(shift);
  } catch (error:any) {
    res.status(400).send({ message: error.message });
  }
};

export const postNewShift = async (req:Request, res: Response) => {
  try {
    const {userId, startDate, endDate, breaks} = req.body
    if (typeof userId !== "string" || !userId) {
      res.status(422).send({ message: "missing userId" });
      return;
    }
    if (typeof startDate !== "string" || !startDate) {
      res.status(422).send({ message: "missing startDate" });
      return;
    }
    if (typeof endDate !== "string" || !endDate) {
      res.status(422).send({ message: "missing endDate" });
      return;
    }
    if (typeof breaks !== "object" || !Array.isArray(breaks)) {
      res.status(422).send({ message: "breaks must be an array" });
      return;
    }
    const totalHours = calculateWorkedHours(startDate, endDate, breaks);
    const shift : Shift = {
      userId: userId,
      startDate,
      endDate,
      breaks,
      totalHours
    };
    
    const response = await shiftService.addShift(shift);
    res.status(201).send({
      message: "shift created successfully",
      ...response,
    });
  } catch (error:any) {
    res.status(400).send({ message: error.message });
  }
};

export const modifyShift = async (req:Request, res: Response) => {
  try {
    const id = req.params.id;
    const shiftUpdate = req.body;
    if (!Object.keys(shiftUpdate).length)
      res
        .status(400)
        .send({ message: "Missing properies for the shift", updated: false });
    else {
      await shiftService.updateShiftById(id, shiftUpdate);
      res.send({
        message: "Shift updated successfully",
        update: true,
        updatedShift: { id: id, ...shiftUpdate },
      });
    }
  } catch (error:any) {
    res.status(400).send({ message: error.message, update: false });
  }
};

export const deleteShift = async (req:Request, res: Response) => {
  try {
    const id = req.params.id;
    await shiftService.deleteShiftById(id);
    res.status(200).send({
      message: "Shift deleted successfully",
      deleted: true,
    });
  } catch (error:any) {
    res.status(400).send({ message: error.message, deleted: false });
  }
};
