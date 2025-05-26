import FirebaseConfig from "../config/FirebaseConfig";
import { AppError } from "../errors/AppError";
import { InternalServerError } from "../errors/HttpErrors";
import type Department from "../models/departments/types/Department";

class DaoFirebaseDepartments {
  private static instance: DaoFirebaseDepartments;
  private firebaseClient: FirebaseConfig<Department>;

  constructor() {
    this.firebaseClient = new FirebaseConfig("departments");
  }

  static getInstance() {
    if (!DaoFirebaseDepartments.instance) {
      DaoFirebaseDepartments.instance = new DaoFirebaseDepartments();
    }
    return DaoFirebaseDepartments.instance;
  }

  async getAll() {
    try {
      return await this.firebaseClient.getAll();
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error; 
      } else {
        throw new InternalServerError("Failed to fetch departments");
      }
    }
  }

  async save(department:Department) {
    try {
      return await this.firebaseClient.save(department);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error; 
      } else {
        throw new InternalServerError("Failed to save department");
      }
    }
  }

  async getById(id:string): Promise<Department & { id: string } | null> {
    try {
      return await this.firebaseClient.getById(id);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error; 
      } else {
        throw new InternalServerError("Failed to fetch department by ID");
      }
    }
  }

  async updateDepartmentById(id:string, departmentUpdate:Partial<Department>) {
    try {
      await this.firebaseClient.updateById(id, departmentUpdate);
      const updatedDepartment = await this.getById(id);
      return updatedDepartment;
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error; 
      } else {
        throw new InternalServerError("Failed to update department");
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
        throw new InternalServerError("Failed to delete department by ID");
      }
    }
  }
}

export default DaoFirebaseDepartments;
