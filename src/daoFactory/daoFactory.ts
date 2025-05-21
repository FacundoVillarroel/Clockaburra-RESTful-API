const DaoFirebaseUsers = require("../dao/DaoFirebaseUsers").default;
const DaoFirebaseClock = require("../dao/DaoFirebaseClock").default;
const DaoFirebaseShifts = require("../dao/DaoFirebaseShifts").default;
const DaoFirebaseTimesheets = require("../dao/DaoFirebaseTimesheets").default;
const DaoFirebaseDepartments = require("../dao/DaoFirebaseDepartments").default;
const DaoFirebaseRoles = require("../dao/DaoFirebaseRoles").default;

type CollectionName = "users" | "clock" | "shifts" | "timesheets" | "departments" | "roles";


class DaoFactory {
  private static instance : DaoFactory;
  
  private constructor() {
    // Private constructor to prevent instantiation
  }

  public static getInstance() {
    if (!DaoFactory.instance) {
      DaoFactory.instance = new DaoFactory();
    }
    return DaoFactory.instance;
  }

  create(dbType:String, collectionName:CollectionName) {
    switch (dbType) {
      case "firebase":
        return DaoFactory.getFirebaseDao(collectionName);
    }
  }

  static getFirebaseDao(collectionName: CollectionName) {
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

export default DaoFactory;
