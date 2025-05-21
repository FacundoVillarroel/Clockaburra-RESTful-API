const daoFactory = require("../daoFactory/daoFactory").default;

const DaoFactoryInstance = daoFactory.getInstance();

const { calculateWorkedHours } = require("../utils/dateHelperFunctions");

class ShiftService {
  constructor(type) {
    this.shifts = DaoFactoryInstance.create(type, "shifts");
  }

  async getShifts(filters) {
    try {
      if (
        !filters.userIds.lenght > 0 &&
        !filters.startDate &&
        !filters.endDate
      ) {
        return await this.shifts.getAllShifts();
      } else {
        return await this.shifts.getByFilters(filters);
      }
    } catch (error) {
      throw Error(error.message);
    }
  }

  async getByUserId(userId, startDate, endDate) {
    try {
      return await this.shifts.filterByUserId(userId, startDate, endDate);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getShiftById(id) {
    try {
      return await this.shifts.getById(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async addShift(shift) {
    try {
      shift.totalHours = calculateWorkedHours(
        shift.startDate,
        shift.endDate,
        shift.breaks
      );
      return await this.shifts.save(shift);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateShiftById(id, update) {
    try {
      update.totalHours = calculateWorkedHours(
        update.startDate,
        update.endDate,
        update.breaks
      );
      await this.shifts.updateById(id, update);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteShiftById(id) {
    try {
      return await this.shifts.deleteById(id);
    } catch (error) {
      throw Error(error.message);
    }
  }
}

module.exports = ShiftService;
