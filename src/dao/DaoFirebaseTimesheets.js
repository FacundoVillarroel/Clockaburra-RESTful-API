const FirebaseConfig = require("../config/FirebaseConfig");

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

  async filterByUserId(userId) {
    try {
      return await this.firebaseClient.filterByCondition(
        "userId",
        "==",
        userId
      );
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
}

module.exports = DaoFirebaseTimesheets;
