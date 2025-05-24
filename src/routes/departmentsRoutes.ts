import express from "express";

import * as departmentsController from "../controllers/departmentsController";

const DepartmentsRouter = express.Router();

DepartmentsRouter.get("/", departmentsController.getDepartments);

DepartmentsRouter.get("/:id", departmentsController.getDepartmentById);

DepartmentsRouter.post("/", departmentsController.postNewDepartment);

DepartmentsRouter.put("/:id", departmentsController.modifyDepartmentById);

DepartmentsRouter.delete("/:id", departmentsController.deleteDepartmentById);

export default DepartmentsRouter;
