import FirebaseConfig, { Condition } from "../config/FirebaseConfig";
import { User } from "../models/users/types/User";

type FilterParams = {
  roles: string[];
  departments: string[];
};



class DaoFirebaseUsers {
  private static instance: DaoFirebaseUsers;
  private firebaseClient: FirebaseConfig<User>;

  private constructor() {
    this.firebaseClient = new FirebaseConfig("users");
  }

  public static getInstance(): DaoFirebaseUsers {
    if (!DaoFirebaseUsers.instance) {
      DaoFirebaseUsers.instance = new DaoFirebaseUsers();
    }
    return DaoFirebaseUsers.instance;
  }

  async getAll(): Promise<(User & { id: string })[] | null> {
    try {
      return await this.firebaseClient.getAll();
    } catch (error:any) {
      throw new Error(error.message || "Unknown error occurred");
    }
  }

  async getByFilters(filters: FilterParams): Promise<(User & { id: string })[] | null> {
    try {
      let conditions: Condition[]= [];
      // Iterate over each filter and push it to the conditions array
      if (filters.roles.length > 0) {
        conditions.push({
          field: "role",
          operator: "in",
          value: filters.roles,
        });
      }

      if (filters.departments.length > 0) {
        conditions.push({
          field: "department",
          operator: "in",
          value: filters.departments,
        });
      }

      return await this.firebaseClient.filterByConditions(conditions);
    } catch (error:any) {
      throw new Error(error.message || "Unknown error occurred");
    }
  }

  async save(user: User): Promise<{ data: User; id: string }> {
    try {
      return await this.firebaseClient.save(user);
    } catch (error:any) {
      throw new Error(error.message || "Unknown error occurred");
    }
  }

  async getById(id: string): Promise<User & { id: string }> {
    try {
      return await this.firebaseClient.getById(id);
    } catch (error:any) {
      throw new Error(error.message || "Unknown error occurred");
    }
  }

  async updateUserById(id:string, userUpdate: Partial<User>): Promise<User & { id: string }> {
    try {
      await this.firebaseClient.updateById(id, userUpdate);
      const updatedUser = await this.getById(id);
      return updatedUser;
    } catch (error:any) {
      throw Error(error.message || "Unknown error occurred");
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      return await this.firebaseClient.deleteById(id);
    } catch (error:any) {
      throw Error(error.message || "Unknown error occurred");
    }
  }
}

export default DaoFirebaseUsers;
