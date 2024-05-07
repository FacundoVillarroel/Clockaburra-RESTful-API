const FirebaseConfig = require("../config/FirebaseConfig");

let instance = null;

class DaoFirebaseClock {
  constructor() {
    this.firebaseClient = new FirebaseConfig("clock");
  }

  static getInstance() {
    if (!instance) instance = new DaoFirebaseClock();
    return instance;
  }

  async getByUserId(userId) {
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

  async addNewClock(clock) {
    try {
      return await this.firebaseClient.save(clock);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateStatus(id, update) {
    try {
      await this.firebaseClient.updateById(id, update);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = DaoFirebaseClock;
