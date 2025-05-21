const DaoFirebaseUsers = require("../dao/DaoFirebaseUsers").default;
const DaoFirebaseClock = require("../dao/DaoFirebaseClock");
const DaoFirebaseShifts = require("../dao/DaoFirebaseShifts").default;
const DaoFirebaseTimesheets = require("../dao/DaoFirebaseTimesheets").default;
const DaoFirebaseDepartments = require("../dao/DaoFirebaseDepartments");
const DaoFirebaseRoles = require("../dao/DaoFirebaseRoles");

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
      case "departments":
        return DaoFirebaseDepartments.getInstance();
      case "roles":
        return DaoFirebaseRoles.getInstance();
      default:
        throw new Error("Invalid collection name");
    }
  }
}

module.exports = DaoFactory;
