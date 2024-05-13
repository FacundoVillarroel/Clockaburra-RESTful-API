const FirebaseConfig = require("../config/FirebaseConfig");

const { DateTime } = require("luxon");

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

  async filterByUserId(userId, startDate, endDate) {
    try {
      let conditions = [{ field: "userId", operator: "==", value: userId }];

      if (startDate) {
        conditions.push({
          field: "startDate",
          operator: ">=",
          value: startDate,
        });
      }
      if (endDate) {
        conditions.push({
          field: "endDate",
          operator: "<=",
          value: endDate,
        });
      } else {
        const endDateTime = DateTime.fromISO(startDate).endOf("week").toISO();
        conditions.push({
          field: "endDate",
          operator: "<=",
          value: endDateTime,
        });
      }
      return await this.firebaseClient.filterByConditions(conditions);
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

  async updateById(id, update) {
    try {
      await this.firebaseClient.updateById(id, update);
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
