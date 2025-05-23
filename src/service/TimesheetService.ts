import daoFactory from "../daoFactory/daoFactory";
import type DaoFirebaseTimesheets from "../dao/DaoFirebaseTimesheets";

const DaoFactoryInstance = daoFactory.getInstance();

import { calculateWorkedHours } from "../utils/dateHelperFunctions";
import type { FilterParams } from "../dao/DaoFirebaseTimesheets";
import type Timesheet from "../models/timesheets/types/Timesheet";

class TimesheetService {
  private timesheets: DaoFirebaseTimesheets;

  constructor(type: "firebase") {
    this.timesheets = DaoFactoryInstance.create(type, "timesheets");
  }

  async getTimesheets(filters: FilterParams) {
    try {
      if (
        filters.userIds.length > 0 ||
        filters.startDate ||
        filters.endDate
      ) {
        return await this.timesheets.getByFilters(filters);
      } else {
        return await this.timesheets.getAll();
      }
    } catch (error:any) {
      throw new Error(error.message);
    }
  }

  async getTimesheetById(id:string) {
    try {
      return await this.timesheets.getById(id);
    } catch (error:any) {
      throw new Error(error.message);
    }
  }

  async getTimesheetsByUser(userId:string, startDate : string | null = null, endDate : string | null = null) {
    try {
      return await this.timesheets.filterByUserId(userId, startDate, endDate);
    } catch (error:any) {
      throw new Error(error.message);
    }
  }

  async changeTimesheetStatus(id:string, action:"approve" | "reject") {
    try {
      if (action === "approve") {
        const update = { approved: true, rejected: false };
        await this.timesheets.updateTimesheetById(id, update);
      } else {
        const update = { approved: false, rejected: true };
        await this.timesheets.updateTimesheetById(id, update);
      }
    } catch (error:any) {
      throw new Error(error.message);
    }
  }

  async createTimesheet(newTimesheet: Timesheet) {
    try {
      return await this.timesheets.save(newTimesheet);
    } catch (error:any) {
      throw new Error(error.message);
    }
  }

  async deleteTimesheetById(id:string) {
    try {
      await this.timesheets.deleteById(id);
    } catch (error:any) {
      throw new Error(error.message);
    }
  }

  async updateAndApproveById(timesheet: Timesheet, id:string) {
    try {
      const timesheetUpdate = {
        ...timesheet,
        expectedHours: null,
        approved: true,
        rejected: false,
        id,
      };
      await this.timesheets.updateTimesheetById(id, timesheetUpdate);
    } catch (error:any) {
      throw new Error(error.message);
    }
  }

  async updateTimesheetById(id:string, date:string, action:string) {
    try {
      const currentTimesheet = await this.timesheets.getById(id);
      if (!currentTimesheet) {
        throw new Error(`there is no timesheet with id: ${id}`);
      }
      const breaks = currentTimesheet.breaks;
      const lastBreakIndex = breaks.length - 1;
      if (action === "out") {
        currentTimesheet.endDate = date;
        if (breaks[lastBreakIndex].breakEnd === null) {
          breaks[lastBreakIndex]["breakEnd"] = date;
          currentTimesheet.actionHistory.push({
            actionType: "breakEnd",
            timeStamp: date,
          });
        }
        const completedBreaks = breaks.map((b) => {
          if (b.breakEnd === null) {
            throw new Error("Hay breaks sin terminar.");
          }
          return {
            breakStart: b.breakStart,
            breakEnd: b.breakEnd,
          };
        });
        currentTimesheet.workedHours = calculateWorkedHours(
          currentTimesheet.startDate,
          currentTimesheet.endDate,
          completedBreaks
        );
      } else {
        if (action === "breakStart") {
          breaks.push({ breakStart: date, breakEnd: null });
        } else {
          breaks[lastBreakIndex]["breakEnd"] = date;
        }
      }
      currentTimesheet.actionHistory.push({
        actionType: action,
        timeStamp: date,
      });
      currentTimesheet.breaks = breaks;
      await this.timesheets.updateTimesheetById(id, currentTimesheet);
    } catch (error:any) {
      throw new Error(error.message);
    }
  }
}

export default TimesheetService;
