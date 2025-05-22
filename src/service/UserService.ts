import daoFactory from "../daoFactory/daoFactory";
import type {
  FilterParams,
  InterfaceUserDao,
} from "../models/users/types/IntefaceUserDao";
import type User from "../models/users/types/User";

const DaoFactoryInstance = daoFactory.getInstance();

class UserService {
  private users: InterfaceUserDao;

  constructor(type:"firebase") {
    this.users = DaoFactoryInstance.create(type, "users");
  }

  async getUsers(filters : FilterParams) {
    try {
      if (filters.roles.length || filters.departments.length > 0) {
        return await this.users.getByFilters(filters);
      } else {
        return await this.users.getAll();
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  async addUser(user : User) {
    try {
      return await this.users.save(user);
    } catch (error:any) {
      throw new Error(error.message);
    }
  }

  async getUserById(id:string) {
    try {
      return await this.users.getById(id);
    } catch (error:any) {
      throw new Error(error.message);
    }
  }

  //añadir que no se pueda cambiar el id, o el email. y que no se pueda añadir algún/clave valor no existente y validaciones
  async updateUserById(id:string, userUpdateData : Partial<User>) {
    try {
      const currentUser = await this.users.getById(id);
      if (!currentUser) {
        throw new Error("user not found");
      }
      const userUpdate = {
        ...currentUser,
        ...userUpdateData,
      };
      const response = await this.users.updateUserById(id, userUpdate);
      return response;
    } catch (error:any) {
      throw new Error(error.message);
    }
  }

  async deleteUserById(id:string) {
    try {
      return await this.users.deleteById(id);
    } catch (error:any) {
      throw new Error(error.message);
    }
  }
}

export default UserService;
