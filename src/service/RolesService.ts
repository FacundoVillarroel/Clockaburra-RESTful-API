import type DaoFirebaseRoles from "../dao/DaoFirebaseRoles";
import daoFactory from "../daoFactory/daoFactory";
import type Role from "../models/roles/types/Role";

const DaoFactoryInstance = daoFactory.getInstance();

class RolesService {
  private roles: DaoFirebaseRoles

  constructor(type:"firebase") {
    this.roles = DaoFactoryInstance.create(type, "roles");
  }

  async getRoles() {
    try {
      return await this.roles.getAll();
    } catch (error:any) {
      throw new Error(error.message);
    }
  }

  async getRoleById(id:string) {
    try {
      return await this.roles.getById(id);
    } catch (error:any) {
      throw new Error(error.message);
    }
  }

  async addRole(role:Role) {
    try {
      return await this.roles.save(role);
    } catch (error:any) {
      throw new Error(error.message);
    }
  }

  async updateRoleById(id:string, roleUpdateData:Partial<Role>) {
    try {
      const currentRole = await this.roles.getById(id);
      if (!currentRole) {
        throw new Error("Role not found");
      }
      const roleUpdate = {
        ...currentRole,
        ...roleUpdateData,
      };
      const response = await this.roles.updateRoleById(id, roleUpdate);
      return response;
    } catch (error:any) {
      throw new Error(error.message);
    }
  }

  async deleteRoleById(id:string) {
    try {
      return await this.roles.deleteById(id);
    } catch (error:any) {
      throw new Error(error.message);
    }
  }
}

export default RolesService;
