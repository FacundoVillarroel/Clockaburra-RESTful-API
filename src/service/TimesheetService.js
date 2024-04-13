const daoFactory = require("../daoFactory/daoFactory");

const DaoFactoryInstance = daoFactory.getInstance();

class TimesheetService {
  constructor(type) {
    this.thimesheets = DaoFactoryInstance.create(type, "timesheets");
  }

  async getAllTimesheets() {
    try {
      return await this.thimesheets.getAll();
    } catch (error) {
      throw new Error(error);
    }
  }

  async createTimesheet(timesheet) {
    try {
      return await this.thimesheets.save(timesheet);
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = TimesheetService;
