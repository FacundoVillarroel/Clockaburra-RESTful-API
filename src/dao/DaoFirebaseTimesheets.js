const FirebaseConfig = require("../config/FirebaseConfig");

let instance = null;

class DaoFirebaseTimesheets {
  constructor() {
    this.FirebaseClient = new FirebaseConfig("timesheets");
  }

  static getInstance() {
    if (!instance) instance = new DaoFirebaseTimesheets();
    return instance;
  }
}

module.exports = DaoFirebaseTimesheets;
