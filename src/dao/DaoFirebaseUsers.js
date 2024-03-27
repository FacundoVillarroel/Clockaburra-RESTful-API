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

  async save(user) {
    return this.firebaseClient.save(user);
  }

  async getById(id) {
    return this.firebaseClient.getById(id);
  }

  async getAll() {
    return await this.firebaseClient.getAll();
  }

  async updateUserDetails(id, payload) {}

  async deleteById(id) {
    return await this.firebaseClient.deleteById(id);
  }

  async deleteAll() {}
}

module.exports = DaoFirebaseUsers;
