const FirebaseConfig = require("../config/FirebaseConfig");

let instance = null;

class DaoFirebaseShifts {
  constructor() {
    this.firebaseClient = new FirebaseConfig("shifts");
  }

  static getInstance() {
    if (!instance) instance = new DaoFirebaseShifts();
    return instance;
  }

  async getAllShifts() {
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
      throw new Error(error.message);
    }
  }

  async save(shift) {
    try {
      return this.firebaseClient.save(shift);
    } catch (error) {
      throw new Error(error.message || "Unknown error occurred");
    }
  }

  async deleteById(id) {
    try {
      return await this.firebaseClient.deleteById(id);
    } catch (error) {
      throw Error(error.message || "Unknown error occurred");
    }
  }
}

module.exports = DaoFirebaseShifts;
