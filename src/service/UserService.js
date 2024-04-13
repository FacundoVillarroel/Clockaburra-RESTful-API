const daoFactory = require("../daoFactory/daoFactory");

const DaoFactoryInstance = daoFactory.getInstance();

class UserService {
  constructor(type) {
    this.users = DaoFactoryInstance.create(type, "users");
  }

  async getAllUsers() {
    try {
      return await this.users.getAll();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async addUser(user) {
    try {
      return await this.users.save(user);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getUserById(id) {
    try {
      return await this.users.getById(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  //añadir que no se pueda cambiar el id, o el email. y que no se pueda añadir algún/clave valor no existente y validaciones
  async updateUserById(id, userUpdateData) {
    try {
      const currentUser = await this.users.getById(id);
      if (!currentUser) {
        throw new Error({ message: "user not found", updated: false });
      }
      const userUpdate = {
        ...currentUser,
        ...userUpdateData,
      };
      const response = await this.users.updateUserById(id, userUpdate);
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteUserById(id) {
    try {
      return await this.users.deleteById(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = UserService;
