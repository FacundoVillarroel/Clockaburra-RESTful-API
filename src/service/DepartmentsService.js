const daoFactory = require("../daoFactory/daoFactory");

const DaoFactoryInstance = daoFactory.getInstance();

class DepartmentsService {
  constructor(type) {
    this.departments = DaoFactoryInstance.create(type, "departments");
  }

  async getDepartments() {
    try {
      return await this.departments.getAll();
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async getDepartmentById(id) {
    try {
      return await this.departments.getById(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async addDepartment(department) {
    try {
      return await this.departments.save(department);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async updateDepartmentById(id, departmentUpdateData) {
    try {
      const currentDepartment = await this.departments.getById(id);
      if (!currentDepartment) {
        throw new Error({ message: "Department not found", updated: false });
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
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteDepartmentById(id) {
    try {
      return await this.departments.deleteById(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = DepartmentsService;
