import type { Request, Response } from "express";

if(process.env.DATA_BASE === undefined || process.env.DATA_BASE !== "firebase" ) {
  throw new Error("DATA_BASE environment variable is not defined or is not set to 'firebase'");
}

import TimesheetService from "../service/TimesheetService";
import {createTimesheetActionHistory} from "../utils/createTimesheetActionHistory";
import { calculateWorkedHours } from "../utils/dateHelperFunctions";
import Timesheet from "../models/timesheets/types/Timesheet";
const timesheetService = new TimesheetService(process.env.DATA_BASE);

export const getTimesheets = async (req: Request, res: Response) => {
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
    const timesheet = await timesheetService.getTimesheets(filters);
    res.send(timesheet);
  } catch (error:any) {
    res.status(400).send({ message: error.message });
  }
};

export const getUserTimesheets = async (req:Request, res:Response) => {
  try {
    const userId = req.params.userId;

    const startDateRaw = req.query.startDate;
    const endDateRaw = req.query.endDate;
    
    const startDate = typeof startDateRaw === "string" ? startDateRaw : null;
    const endDate = typeof endDateRaw === "string" ? endDateRaw : null;

    const timesheets = await timesheetService.getTimesheetsByUser(
      userId,
      startDate,
      endDate
    );
    res.send(timesheets);
  } catch (error:any) {
    res.status(400).send({ message: error.message });
  }
};

export const getTimesheetById = async (req:Request, res:Response) => {
  try {
    const timesheetId = req.params.timesheetId;
    const timesheet = await timesheetService.getTimesheetById(timesheetId);
    res.send(timesheet);
  } catch (error:any) {
    res.status(400).send({ message: error.message });
  }
};

export const postNewTimesheet = async (req:Request, res:Response) => {
  try {
    const userId = req.body.userId;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const breaks = req.body.breaks; 
    const expectedHours = req.body.expectedHours || null;
    const actionHistory = createTimesheetActionHistory(
      startDate,
      breaks,
      endDate
    );
    const workedHours = calculateWorkedHours(startDate, endDate, breaks);
    const newTimesheet : Timesheet = {
      userId,
      startDate,
      expectedHours,
      endDate,
      breaks,
      actionHistory,
      workedHours,
      approved:false,
      rejected:false
    };
    const response = await timesheetService.createTimesheet(newTimesheet);
    res.status(201).json({
      message: "timesheet created successfully",
      ...response,
    });
  } catch (error:any) {
    res.status(400).send({ message: error.message });
  }
};

export const updateTimesheet = async (req:Request, res:Response) => {
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
    await timesheetService.updateAndApproveById(
      timesheetUpdate,
      timesheetId
    );
    res.status(201).json({
      message: "Timesheet updated & approved successfully",
    });
  } catch (error:any) {
    res.status(400).send({ message: error.message });
  }
};

export const approveTimesheet = async (req:Request, res:Response) => {
  try {
    const id = req.body.id;
    await timesheetService.changeTimesheetStatus(id, "approve");
    res.send({ message: "timesheet approved successfully", updated: true });
  } catch (error:any) {
    res.status(400).send({ message: error.message, updated: false });
  }
};

export const rejectTimesheet = async (req:Request, res:Response) => {
  try {
    const id = req.body.id;
    await timesheetService.changeTimesheetStatus(id, "reject");
    res.send({ message: "timesheet rejected succesfully", updated: true });
  } catch (error:any) {
    res.status(400).send({ message: error.message, updated: false });
  }
};

export const deleteTimesheetById = async (req:Request, res:Response) => {
  try {
    const id = req.params.id;
    await timesheetService.deleteTimesheetById(id);
    res.send({ message: "Timesheet deletede successfully", deleted: true });
  } catch (error:any) {
    res.status(400).send({ message: error.message, deleted: false });
  }
};

