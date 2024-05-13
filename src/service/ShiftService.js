const daoFactory = require("../daoFactory/daoFactory");

const DaoFactoryInstance = daoFactory.getInstance();

const { calculateWorkedHours } = require("../utils/dateHelperFunctions");

class ShiftService {
  constructor(type) {
    this.shifts = DaoFactoryInstance.create(type, "shifts");
  }

  async getAllShifts() {
    try {
      return await this.shifts.getAllShifts();
    } catch (error) {
      throw Error(error.message);
    }
  }

  async getByUserId(userId) {
    try {
      return await this.shifts.filterByUserId(userId);
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
