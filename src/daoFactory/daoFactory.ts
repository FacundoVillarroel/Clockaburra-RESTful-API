import DaoFirebaseUsers from "../dao/DaoFirebaseUsers";
import DaoFirebaseClock from "../dao/DaoFirebaseClock";
import DaoFirebaseShifts from "../dao/DaoFirebaseShifts";
import DaoFirebaseTimesheets from "../dao/DaoFirebaseTimesheets";
import DaoFirebaseDepartments from "../dao/DaoFirebaseDepartments";
import DaoFirebaseRoles from "../dao/DaoFirebaseRoles";

import { type InterfaceUserDao } from "../models/users/types/IntefaceUserDao";

type DbType = "firebase";
type CollectionName =
  | "users"
  | "clock"
  | "shifts"
  | "timesheets"
  | "departments"
  | "roles";

type AnyDao =
  | DaoFirebaseUsers
  | DaoFirebaseClock
  | DaoFirebaseShifts
  | DaoFirebaseTimesheets
  | DaoFirebaseDepartments
  | DaoFirebaseRoles;

class DaoFactory {
  private static instance: DaoFactory;

  private constructor() {
    // Private constructor to prevent instantiation
  }

  public static getInstance() {
    if (!DaoFactory.instance) {
      DaoFactory.instance = new DaoFactory();
    }
    return DaoFactory.instance;
  }

  // Overload for every instance of Dao
  create<T>(dbType: DbType, collectionName: "users"): InterfaceUserDao;
  create<T>(dbType: DbType, collection: "clock"): DaoFirebaseClock;
  create<T>(dbType: DbType, collection: "shifts"): DaoFirebaseShifts;
  create<T>(dbType: DbType, collection: "timesheets"): DaoFirebaseTimesheets;
  create<T>(dbType: DbType, collection: "departments"): DaoFirebaseDepartments;
  create<T>(dbType: DbType, collection: "roles"): DaoFirebaseRoles;

  create<T extends AnyDao>(dbType: DbType, collectionName: CollectionName): T {
    switch (dbType) {
      case "firebase":
        return DaoFactory.getFirebaseDao(collectionName) as T;
      default:
        throw new Error("Invalid database type");
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
