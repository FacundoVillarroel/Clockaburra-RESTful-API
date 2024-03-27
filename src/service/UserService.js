const daoFactory = require("../daoFactory/daoFactory");

const userDatabase = daoFactory.getInstance();

class UserService {
  constructor(type) {
    this.users = userDatabase.create(type);
  }

  async getAllUsers() {
    try {
      return await this.users.getAll();
    } catch (err) {
      console.log(err);
    }
  }

  async addUser(user) {
    try {
      return this.users.save(user);
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = UserService;
