import FirebaseConfig, { Condition } from "../config/FirebaseConfig";
import { DateTime } from "luxon";
import { AppError } from "../errors/AppError";
import { InternalServerError } from "../errors/HttpErrors";
import type Timesheet from "../models/timesheets/types/Timesheet";

export type FilterParams = {
  userIds: string[];
  startDate?: string | null;
  endDate?: string | null;
};

class DaoFirebaseTimesheets {
  private static instance: DaoFirebaseTimesheets;
  private firebaseClient: FirebaseConfig<Timesheet>;

  private constructor() {
    this.firebaseClient = new FirebaseConfig("timesheets");
  }

  public static getInstance(): DaoFirebaseTimesheets {
    if (!DaoFirebaseTimesheets.instance) {
      DaoFirebaseTimesheets.instance = new DaoFirebaseTimesheets();
    }
    return DaoFirebaseTimesheets.instance;
  }

  async getAll() {
    try {
      return await this.firebaseClient.getAll();
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error; 
      } else {
        throw new InternalServerError("Failed to fetch timesheets");
      }
    }
  }

  async getById(id: string): Promise<(Timesheet & { id: string }) | null> {
    try {
      return await this.firebaseClient.getById(id);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error; 
      } else {
        throw new InternalServerError("Failed to fetch timesheet by ID");
      }
    }
  }

  async getByFilters(filters: FilterParams): Promise<Timesheet[] | null> {
    try {
      let conditions: Condition[] = [];
      // Iterate over each filter and push it to the conditions array
      if (filters.userIds.length > 0) {
        conditions.push({
          field: "userId",
          operator: "in",
          value: filters.userIds,
        });
      }

      if (filters.startDate) {
        conditions.push({
          field: "startDate",
          operator: ">=",
          value: filters.startDate,
        });
      }

      if (filters.endDate) {
        conditions.push({
          field: "endDate",
          operator: "<=",
          value: filters.endDate,
        });
      }

      return await this.firebaseClient.filterByConditions(conditions);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error; 
      } else {
        throw new InternalServerError("Failed to fetch timesheets by filters");
      }
    }
  }

  async filterByUserId(
    userId: string,
    startDate: string | null,
    endDate: string | null
  ) {
    try {
      const conditions: Condition[] = [
        { field: "userId", operator: "==", value: userId },
      ];

      if (startDate) {
        conditions.push({
          field: "startDate",
          operator: ">=",
          value: startDate,
        });
        if (endDate) {
          conditions.push({
            field: "endDate",
            operator: "<=",
            value: endDate,
          });
        } else {
          const endDateTime = DateTime.fromISO(startDate).endOf("week").toISO();
          endDateTime &&
            conditions.push({
              field: "endDate",
              operator: "<=",
              value: endDateTime,
            });
        }
      }
      return await this.firebaseClient.filterByConditions(conditions);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error; 
      } else {
        throw new InternalServerError("Failed to fetch timesheets by user ID");
      }
    }
  }

  async updateTimesheetById(
    id: string,
    update: Partial<Timesheet>
  ): Promise<void> {
    try {
      await this.firebaseClient.updateById(id, update);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error; 
      } else {
        throw new InternalServerError("Failed to Update timesheet by ID");
      }
    }
  }

  async save(timesheet: Timesheet): Promise<{ data: Timesheet; id: string }> {
    try {
      return this.firebaseClient.save(timesheet);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error; 
      } else {
        throw new InternalServerError("Failed to save timesheet");
      }
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      await this.firebaseClient.deleteById(id);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error; 
      } else {
        throw new InternalServerError("Failed to delete timesheet by ID");
      }
    }
  }
}

export default DaoFirebaseTimesheets;
