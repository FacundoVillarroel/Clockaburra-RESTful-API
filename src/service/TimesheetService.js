const daoFactory = require("../daoFactory/daoFactory");

const DaoFactoryInstance = daoFactory.getInstance();

class TimesheetService {
  constructor(type) {
    this.timesheets = DaoFactoryInstance.create(type, "timesheets");
  }

  async getAllTimesheets() {
    try {
      return await this.timesheets.getAll();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getTimesheetById(id) {
    try {
      return await this.timesheets.getById(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getTimesheetsByUser(userId) {
    try {
      return await this.timesheets.filterByUserId(userId);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async changeTimesheetStatus(id, action) {
    try {
      if (action === "approve") {
        const update = { approved: true, rejected: false };
        await this.timesheets.updateTimesheetById(id, update);
      } else {
        const update = { approved: false, rejected: true };
        await this.timesheets.updateTimesheetById(id, update);
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createTimesheet(timesheet) {
    try {
      return await this.timesheets.save(timesheet);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = TimesheetService;
