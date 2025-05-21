const daoFactory = require("../daoFactory/daoFactory").default;

const DaoFactoryInstance = daoFactory.getInstance();

class RolesService {
  constructor(type) {
    this.roles = DaoFactoryInstance.create(type, "roles");
  }

  async getRoles() {
    try {
      return await this.roles.getAll();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getRoleById(id) {
    try {
      return await this.roles.getById(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async addRole(role) {
    try {
      return await this.roles.save(role);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateRoleById(id, roleUpdateData) {
    try {
      const currentRole = await this.roles.getById(id);
      if (!currentRole) {
        throw new Error({ message: "Role not found", updated: false });
      }
      const roleUpdate = {
        ...currentRole,
        ...roleUpdateData,
      };
      const response = await this.roles.updateRoleById(id, roleUpdate);
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteRoleById(id) {
    try {
      return await this.roles.deleteById(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = RolesService;
