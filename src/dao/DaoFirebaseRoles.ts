import FirebaseConfig from "../config/FirebaseConfig";
import { AppError } from "../errors/AppError";
import { InternalServerError } from "../errors/HttpErrors";
import type Role from "../models/roles/types/Role";

class DaoFirebaseRoles {
  private static instance: DaoFirebaseRoles;
  private firebaseClient: FirebaseConfig<Role>;

  private constructor() {
    this.firebaseClient = new FirebaseConfig("roles");
  }

  public static getInstance() {
    if (!DaoFirebaseRoles.instance) {
      DaoFirebaseRoles.instance = new DaoFirebaseRoles();
    }
    return DaoFirebaseRoles.instance;
  }

  async getAll() {
    try {
      return await this.firebaseClient.getAll();
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error; 
      } else {
        throw new InternalServerError("Failed to fetch roles");
      }
    }
  }

  async save(role:Role) {
    try {
      return await this.firebaseClient.save(role);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error; 
      } else {
        throw new InternalServerError("Failed to save role");
      }
    }
  }

  async getById(id:string): Promise<Role & { id: string } | null> {
    try {
      return await this.firebaseClient.getById(id);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error; 
      } else {
        throw new InternalServerError("Failed to fetch role by ID");
      }
    }
  }

  async updateRoleById(id:string, roleUpdate:Partial<Role>) {
    try {
      await this.firebaseClient.updateById(id, roleUpdate);
      const updatedRole = await this.getById(id);
      return updatedRole;
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error; 
      } else {
        throw new InternalServerError("Failed to update role");
      }
    }
  }

  async deleteById(id:string) {
    try {
      return await this.firebaseClient.deleteById(id);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error; 
      } else {
        throw new InternalServerError("Failed to delete role");
      }
    }
  }
}

export default DaoFirebaseRoles;
