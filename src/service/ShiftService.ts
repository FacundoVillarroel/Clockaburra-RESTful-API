import DaoFirebaseShifts, { FilterParams } from "../dao/DaoFirebaseShifts";
import daoFactory from "../daoFactory/daoFactory";
import Shift from "../models/shifts/types/Shift";

const DaoFactoryInstance = daoFactory.getInstance();

import { calculateWorkedHours } from "../utils/dateHelperFunctions";

class ShiftService {
private shifts : DaoFirebaseShifts

  constructor(type:"firebase") {
    this.shifts = DaoFactoryInstance.create(type, "shifts");
  }

  async getShifts(filters: FilterParams) {
    try {
      if (
        filters.userIds.length > 0 ||
        filters.startDate ||
        filters.endDate
      ) {
        return await this.shifts.getByFilters(filters);
      } else {
        return await this.shifts.getAllShifts();
      }
    } catch (error: any) {
      throw Error(error.message);
    }
  }

  async getByUserId(userId:string, startDate:string | null, endDate:string | null) {
    try {
      return await this.shifts.filterByUserId(userId, startDate, endDate);
    } catch (error:any) {
      throw new Error(error.message);
    }
  }

  async getShiftById(id: string) {
    try {
      return await this.shifts.getById(id);
    } catch (error:any) {
      throw new Error(error.message);
    }
  }

  async addShift(shift: Shift) {
    try {
      shift.totalHours = calculateWorkedHours(
        shift.startDate,
        shift.endDate,
        shift.breaks
      );
      return await this.shifts.save(shift);
    } catch (error:any) {
      throw new Error(error.message);
    }
  }

  async updateShiftById(id:string, update:Shift) {
    try {
      update.totalHours = calculateWorkedHours(
        update.startDate,
        update.endDate,
        update.breaks
      );
      await this.shifts.updateById(id, update);
    } catch (error:any) {
      throw new Error(error.message);
    }
  }

  async deleteShiftById(id:string) {
    try {
      return await this.shifts.deleteById(id);
    } catch (error:any) {
      throw Error(error.message);
    }
  }
}

export default ShiftService;
