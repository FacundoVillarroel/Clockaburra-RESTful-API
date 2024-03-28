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
      throw new Error(error);
    }
  }

  async addUser(user) {
    try {
      return this.users.save(user);
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = UserService;
