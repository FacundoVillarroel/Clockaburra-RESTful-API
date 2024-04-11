const DaoFirebaseUsers = require("../dao/DaoFirebaseUsers");
const DaoFirebaseClock = require("../dao/DaoFirebaseClock");
const DaoFirebaseShifts = require("../dao/DaoFirebaseShifts");
const DaoFirebaseTimesheets = require("../dao/DaoFirebaseTimesheets");

let instance = null;

class DaoFactory {
  static getInstance() {
    if (!instance) instance = new DaoFactory();
    return instance;
  }

  create(dbType, collectionName) {
    switch (dbType) {
      case "firebase":
        return DaoFactory.getFirebaseDao(collectionName);
    }
  }

  static getFirebaseDao(collectionName) {
    switch (collectionName) {
      case "users":
        return DaoFirebaseUsers.getInstance();
      case "clock":
        return DaoFirebaseClock.getInstance();
      case "shifts":
        return DaoFirebaseShifts.getInstance();
      case "timesheets":
        return DaoFirebaseTimesheets.getInstance();
      default:
        throw new Error("Invalid collection name");
    }
  }
}

module.exports = DaoFactory;
