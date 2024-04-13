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

  async save(timesheet) {
    try {
      return this.firebaseClient.save(timesheet);
    } catch (error) {
      throw new Error(error.message || "Unknown error occurred");
    }
  }
}

module.exports = DaoFirebaseTimesheets;
