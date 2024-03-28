const daoFactory = require("../daoFactory/daoFactory");

const userDatabase = daoFactory.getInstance();

class UserService {
  constructor(type) {
    this.users = userDatabase.create(type);
  }

  async getAllUsers() {
    try {
      return await this.users.getAll();
    } catch (error) {
      throw Error(error);
    }
  }

  async addUser(user) {
    try {
      return await this.users.save(user);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getUserById(id) {
    try {
      return await this.users.getById(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteUserById(id) {
    try {
      return await this.users.deleteById(id);
    } catch (error) {
      throw Error(error.message);
    }
  }
}

module.exports = UserService;
