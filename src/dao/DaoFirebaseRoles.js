const FirebaseConfig = require("../config/FirebaseConfig");

let instance = null;

class DaoFirebaseRoles {
  constructor() {
    this.firebaseClient = new FirebaseConfig("roles");
  }

  static getInstance() {
    if (!instance) instance = new DaoFirebaseRoles();
    return instance;
  }

  async getAll() {
    try {
      return await this.firebaseClient.getAll();
    } catch (error) {
      throw new Error(error.message || "Unknown error occurred");
    }
  }

  async save(role) {
    try {
      return await this.firebaseClient.save(role);
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

  async updateRoleById(id, roleUpdate) {
    try {
      await this.firebaseClient.updateById(id, roleUpdate);
      const updatedRole = await this.getById(id);
      return updatedRole;
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

module.exports = DaoFirebaseRoles;
