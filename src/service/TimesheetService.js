const daoFactory = require("../daoFactory/daoFactory");

const DaoFactoryInstance = daoFactory.getInstance();

const { calculateWorkedHours } = require("../utils/dateHelperFunctions");

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

  async getTimesheetsByUser(userId, startDate = null, endDate = null) {
    try {
      return await this.timesheets.filterByUserId(userId, startDate, endDate);
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

  async createTimesheet(userId, startDate, expectedHours = null) {
    try {
      const newTimesheet = {
        userId,
        startDate,
        endDate: null,
        expectedHours,
        workedHours: null,
        breaks: [],
        actionHistory: [{ actionType: "checkIn", timeStamp: startDate }],
        approved: false,
        rejected: false,
      };
      return await this.timesheets.save(newTimesheet);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteTimesheetById(id) {
    try {
      await this.timesheets.deleteById(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateTimesheetById(id, date, action) {
    try {
      const currentTimesheet = await this.timesheets.getById(id);
      if (action === "out") {
        currentTimesheet.endDate = date;
        currentTimesheet.workedHours = calculateWorkedHours(
          currentTimesheet.startDate,
          currentTimesheet.endDate,
          currentTimesheet.breaks
        );
        if (currentTimesheet.breaks.length % 2 !== 0) {
          currentTimesheet.breaks.push({
            actionType: "breakEnd",
            timeStamp: date,
          });
          currentTimesheet.actionHistory.push({
            actionType: "breakEnd",
            timeStamp: date,
          });
        }
      } else {
        currentTimesheet.breaks.push({ actionType: action, timeStamp: date });
      }
      currentTimesheet.actionHistory.push({
        actionType: action,
        timeStamp: date,
      });
      this.timesheets.updateTimesheetById(id, currentTimesheet);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = TimesheetService;
