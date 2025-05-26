import FirebaseConfig, { Condition } from "../config/FirebaseConfig";
import { AppError } from "../errors/AppError";
import { InternalServerError } from "../errors/HttpErrors";
import type User from "../models/users/types/User";

import {
  type InterfaceUserDao,
  type FilterParams,
} from "../models/users/types/IntefaceUserDao";

class DaoFirebaseUsers implements InterfaceUserDao {
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
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error; 
      } else {
        throw new InternalServerError("Failed to fetch users");
      }
    }
  }

  async getByFilters(
    filters: FilterParams
  ): Promise<(User & { id: string })[] | null> {
    try {
      let conditions: Condition[] = [];
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
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error; 
      } else {
        throw new InternalServerError("Failed to fetch users by filters");
      }
    }
  }

  async save(user: User): Promise<{ data: User; id: string }> {
    try {
      return await this.firebaseClient.save(user);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error; 
      } else {
        throw new InternalServerError("Failed to save user");
      }
    }
  }

  async getById(id: string): Promise<User & { id: string }> {
    try {
      return await this.firebaseClient.getById(id);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error; 
      } else {
        throw new InternalServerError("Failed get user by ID");
      }
    }
  }

  async updateUserById(
    id: string,
    userUpdate: Partial<User>
  ): Promise<User & { id: string }> {
    try {
      await this.firebaseClient.updateById(id, userUpdate);
      const updatedUser = await this.getById(id);
      return updatedUser;
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error; 
      } else {
        throw new InternalServerError("Failed to update user");
      }
    }
  }

  async deleteById(id: string): Promise<void> {
    try {
      return await this.firebaseClient.deleteById(id);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error; 
      } else {
        throw new InternalServerError("Failed delete user by ID");
      }
    }
  }
}

export default DaoFirebaseUsers;
