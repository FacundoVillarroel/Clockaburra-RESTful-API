import FirebaseConfig, { Condition } from "../config/FirebaseConfig";

import { DateTime } from "luxon";
import type Shift from "../models/shifts/types/Shift";

export type FilterParams = {
  userIds: string[];
  startDate?: string | null;
  endDate?: string | null;
};

class DaoFirebaseShifts {
  private static instance: DaoFirebaseShifts;
  private firebaseClient: FirebaseConfig<Shift>;

  private constructor() {
    this.firebaseClient = new FirebaseConfig("shifts");
  }

  public static getInstance() {
    if (!DaoFirebaseShifts.instance) {
      DaoFirebaseShifts.instance = new DaoFirebaseShifts();
    }
    return DaoFirebaseShifts.instance;
  }

  async getAllShifts() {
    try {
      return await this.firebaseClient.getAll();
    } catch (error: any) {
      throw new Error(error.message || "Unknown error occurred");
    }
  }

  async getById(id: string): Promise<(Shift & { id: string }) | null> {
    try {
      return await this.firebaseClient.getById(id);
    } catch (error: any) {
      throw new Error(error.message || "Unknown error occurred");
    }
  }

  async getByFilters(
    filters: FilterParams
  ): Promise<(Shift & { id: string })[]> {
    try {
      const conditions: Condition[] = [];
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
    } catch (error: any) {
      throw new Error(error.message || "Unknown error occurred");
    }
  }

  async filterByUserId(
    userId: string,
    startDate: string | null,
    endDate: string | null
  ): Promise<(Shift & { id: string })[]> {
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
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async save(shift: Shift): Promise<{ data: Shift; id: string }> {
    try {
      return this.firebaseClient.save(shift);
    } catch (error: any) {
      throw new Error(error.message || "Unknown error occurred");
    }
  }

  async updateById(id: string, update: Partial<Shift>): Promise<void> {
    try {
      await this.firebaseClient.updateById(id, update);
    } catch (error: any) {
      throw new Error(error.message || "Unknown error occurred");
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      return await this.firebaseClient.deleteById(id);
    } catch (error: any) {
      throw Error(error.message || "Unknown error occurred");
    }
  }
}

export default DaoFirebaseShifts;
