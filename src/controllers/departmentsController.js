const DepartmentsService = require("../service/DepartmentsService");
const departmentsService = new DepartmentsService(process.env.DATA_BASE);

exports.getDepartments = async (req, res, next) => {
  try {
    const departments = await departmentsService.getDepartments();
    res.send(departments);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.getDepartmentById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const department = await departmentsService.getDepartmentById(id);
    res.send(department);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.postNewDepartment = async (req, res, next) => {
  try {
    const department = {
      name: req.body.name,
      description: req.body.description,
    };
    if (!department.name) {
      res.status(422).send({ message: "Department Name can not be empty" });
    }
    const response = await departmentsService.addDepartment(department);
    res.status(201).send({
      message: "department created successfully",
      ...response,
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.modifyDepartmentById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const departmentUpdate = req.body;
    if (!Object.keys(departmentUpdate).length) {
      res
        .status(400)
        .send({
          message: "department update can not be empty",
          updated: false,
        });
    } else {
      await departmentsService.updateDepartmentById(id, departmentUpdate);
      res.send({
        message: "Department updated successfully",
        updated: true,
        updatedDepartment: { id: id, ...departmentUpdate },
      });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.deleteDepartmentById = async (req, res, next) => {
  try {
    const id = req.params.id;
    await departmentsService.deleteDepartmentById(id);
    res.status(200).send({
      message: "Department deleted successfully",
      deleted: true,
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
