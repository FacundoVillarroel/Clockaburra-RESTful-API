const FirebaseConfig = require("../config/FirebaseConfig");

let instance = null;

class DaoFirebaseUsers {
  constructor() {
    this.firebaseClient = new FirebaseConfig("users");
  }

  static getInstance() {
    if (!instance) instance = new DaoFirebaseUsers();
    return instance;
  }

  async getAll() {
    try {
      return await this.firebaseClient.getAll();
    } catch (error) {
      throw new Error(error.message || "Unknown error occurred");
    }
  }

  async save(user) {
    try {
      return await this.firebaseClient.save(user);
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

  async updateUserById(id, userUpdate) {
    try {
      await this.firebaseClient.updateById(id, userUpdate);
      const updatedUser = await this.getById(id);
      return updatedUser;
    } catch (error) {
      throw Error(error.message || "Unknown error occurred");
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

module.exports = DaoFirebaseUsers;
