const FirebaseConfig = require("../config/FirebaseConfig").default;
const { DateTime } = require("luxon");

let instance = null;

class DaoFirebaseTimesheets {
  constructor() {
    this.firebaseClient = new FirebaseConfig("timesheets");
  }

  static getInstance() {
    if (!instance) instance = new DaoFirebaseTimesheets();
    return instance;
  }

  async getAll() {
    try {
      return await this.firebaseClient.getAll();
    } catch (error) {
      throw new Error(error.message || "Unknown error occurred");
    }
  }

  async getById(id) {
    try {
      return await this.firebaseClient.getById(id);
    } catch (error) {
      throw new Error(error.message || "Unknown error occurred");
    }
  }

  async getByFilters(filters) {
    try {
      let conditions = [];
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
    } catch (error) {
      throw new Error(error.message || "Unknown error occurred");
    }
  }

  async filterByUserId(userId, startDate, endDate) {
    try {
      let conditions = [{ field: "userId", operator: "==", value: userId }];

      if (startDate) {
        conditions.push({
          field: "startDate",
          operator: ">=",
          value: startDate,
        });
      }
      if (endDate) {
        conditions.push({
          field: "endDate",
          operator: "<=",
          value: endDate,
        });
      } else {
        const endDateTime = DateTime.fromISO(startDate).endOf("week").toISO();
        conditions.push({
          field: "endDate",
          operator: "<=",
          value: endDateTime,
        });
      }
      return await this.firebaseClient.filterByConditions(conditions);
    } catch (error) {
      throw new Error(error.message || "Unknown error occurred");
    }
  }

  async updateTimesheetById(id, update) {
    try {
      await this.firebaseClient.updateById(id, update);
    } catch (error) {
      throw new Error(error.message || "Unknown error occurred");
    }
  }

  async save(timesheet) {
    try {
      return this.firebaseClient.save(timesheet);
    } catch (error) {
      throw new Error(error.message || "Unknown error occurred");
    }
  }

  async deleteById(id) {
    try {
      await this.firebaseClient.deleteById(id);
    } catch (error) {
      throw new Error(error.message || "Unknown error occurred");
    }
  }
}

module.exports = DaoFirebaseTimesheets;
