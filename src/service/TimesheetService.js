const daoFactory = require("../daoFactory/daoFactory");

const DaoFactoryInstance = daoFactory.getInstance();

const { calculateWorkedHours } = require("../utils/dateHelperFunctions");

class TimesheetService {
  constructor(type) {
    this.timesheets = DaoFactoryInstance.create(type, "timesheets");
  }

  async getTimesheets() {
    try {
      if (
        !filters.userIds.lenght > 0 &&
        !filters.startDate &&
        !filters.endDate
      ) {
        return await this.timesheets.getAll();
      } else {
        return await this.timesheets.getByFilters(filters);
      }
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
      const breaks = currentTimesheet.breaks;
      const lastBreakIndex = breaks.length - 1;
      if (action === "out") {
        currentTimesheet.endDate = date;
        if (breaks.length && breaks[lastBreakIndex].breakEnd === null) {
          breaks[lastBreakIndex]["breakEnd"] = date;
          currentTimesheet.actionHistory.push({
            actionType: "breakEnd",
            timeStamp: date,
          });
        }
        currentTimesheet.workedHours = calculateWorkedHours(
          currentTimesheet.startDate,
          currentTimesheet.endDate,
          breaks
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
      this.timesheets.updateTimesheetById(id, currentTimesheet);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = TimesheetService;
