const FirebaseConfig = require("../config/FirebaseConfig");

let instance = null;

class DaoFirebaseClock {
  constructor() {
    this.FirebaseClient = new FirebaseConfig("clock");
  }

  static getInstance() {
    if (!instance) instance = new DaoFirebaseClock();
    return instance;
  }
}

module.exports = DaoFirebaseClock;
