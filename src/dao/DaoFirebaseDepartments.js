const FirebaseConfig = require("../config/FirebaseConfig").default;

let instance = null;

class DaoFirebaseDepartments {
  constructor() {
    this.firebaseClient = new FirebaseConfig("departments");
  }

  static getInstance() {
    if (!instance) instance = new DaoFirebaseDepartments();
    return instance;
  }

  async getAll() {
    try {
      return await this.firebaseClient.getAll();
    } catch (error) {
      throw new Error(error.message || "Unknown error occurred");
    }
  }

  async save(department) {
    try {
      return await this.firebaseClient.save(department);
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

  async updateDepartmentById(id, departmentUpdate) {
    try {
      await this.firebaseClient.updateById(id, departmentUpdate);
      const updatedDepartment = await this.getById(id);
      return updatedDepartment;
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

module.exports = DaoFirebaseDepartments;
