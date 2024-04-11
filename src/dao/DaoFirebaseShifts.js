const FirebaseConfig = require("../config/FirebaseConfig");

let instance = null;

class DaoFirebaseShifts {
  constructor() {
    this.FirebaseClient = new FirebaseConfig("shifts");
  }

  static getInstance() {
    if (!instance) instance = new DaoFirebaseShifts();
    return instance;
  }
}

module.exports = DaoFirebaseShifts;
