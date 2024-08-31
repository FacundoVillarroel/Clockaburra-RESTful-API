const express = require("express");

const departmentsController = require("../controllers/departmentsController");

const DepartmentsRouter = express.Router();

DepartmentsRouter.get("/", departmentsController.getDepartments);

DepartmentsRouter.get("/:id", departmentsController.getDepartmentById);

DepartmentsRouter.post("/", departmentsController.postNewDepartment);

DepartmentsRouter.put("/:id", departmentsController.modifyDepartmentById);

DepartmentsRouter.delete("/:id", departmentsController.deleteDepartmentById);

module.exports = DepartmentsRouter;
