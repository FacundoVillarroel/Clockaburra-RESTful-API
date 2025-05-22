import type DaoFirebaseDepartments from "../dao/DaoFirebaseDepartments";
import daoFactory from "../daoFactory/daoFactory";
import type Department from "../models/departments/types/Department";

const DaoFactoryInstance = daoFactory.getInstance();

class DepartmentsService {
  private departments: DaoFirebaseDepartments

  constructor(type:"firebase") {
    this.departments = DaoFactoryInstance.create(type, "departments");
  }

  async getDepartments() {
    try {
      return await this.departments.getAll();
    } catch (error:any) {
      throw new Error(error.message);
    }
  }

  async getDepartmentById(id:any) {
    try {
      return await this.departments.getById(id);
    } catch (error:any) {
      throw new Error(error.message);
    }
  }

  async addDepartment(department:Department) {
    try {
      return await this.departments.save(department);
    } catch (error:any) {
      throw new Error(error.message);
    }
  }

  async updateDepartmentById(id:string, departmentUpdateData:Partial<Department>) {
    try {
      const currentDepartment = await this.departments.getById(id);
      if (!currentDepartment) {
        throw new Error("Department not found");
      }
      const departmentUpdate = {
        ...currentDepartment,
        ...departmentUpdateData,
      };
      const response = await this.departments.updateDepartmentById(
        id,
        departmentUpdate
      );
      return response;
    } catch (error:any) {
      throw new Error(error.message);
    }
  }

  async deleteDepartmentById(id:string) {
    try {
      return await this.departments.deleteById(id);
    } catch (error:any) {
      throw new Error(error.message);
    }
  }
}

export default DepartmentsService;
