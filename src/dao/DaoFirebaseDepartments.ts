import FirebaseConfig from "../config/FirebaseConfig";
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
    } catch (error:any) {
      throw new Error(error.message || "Unknown error occurred");
    }
  }

  async save(department:Department) {
    try {
      return await this.firebaseClient.save(department);
    } catch (error:any) {
      throw new Error(error.message || "Unknown error occurred");
    }
  }

  async getById(id:string): Promise<Department & { id: string } | null> {
    try {
      return await this.firebaseClient.getById(id);
    } catch (error:any) {
      throw new Error(error.message || "Unknown error occurred");
    }
  }

  async updateDepartmentById(id:string, departmentUpdate:Partial<Department>) {
    try {
      await this.firebaseClient.updateById(id, departmentUpdate);
      const updatedDepartment = await this.getById(id);
      return updatedDepartment;
    } catch (error:any) {
      throw Error(error.message || "Unknown error occurred");
    }
  }

  async deleteById(id:string) {
    try {
      return await this.firebaseClient.deleteById(id);
    } catch (error:any) {
      throw Error(error.message || "Unknown error occurred");
    }
  }
}

export default DaoFirebaseDepartments;
