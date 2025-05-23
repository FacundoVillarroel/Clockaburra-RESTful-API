import type { Request, Response } from "express";
import Department from "../models/departments/types/Department";

if(process.env.DATA_BASE === undefined || process.env.DATA_BASE !== "firebase" ) {
  throw new Error("DATA_BASE environment variable is not defined or is not set to 'firebase'");
}

const DepartmentsService = require("../service/DepartmentsService").default;
const departmentsService = new DepartmentsService(process.env.DATA_BASE);

export const getDepartments = async (req:Request, res:Response) => {
  try {
    const departments = await departmentsService.getDepartments();
    res.send(departments);
  } catch (error:any) {
    res.status(400).send({ message: error.message });
  }
};

export const getDepartmentById = async (req:Request, res:Response) => {
  try {
    const id = req.params.id;
    const department = await departmentsService.getDepartmentById(id);
    res.send(department);
  } catch (error:any) {
    res.status(400).send({ message: error.message });
  }
};

export const postNewDepartment = async (req:Request, res:Response) => {
  try {
    const department : Department = {
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
  } catch (error:any) {
    res.status(400).send({ message: error.message });
  }
};

export const modifyDepartmentById = async (req:Request, res:Response) => {
  try {
    const id = req.params.id;
    const departmentUpdate = req.body;
    if (!Object.keys(departmentUpdate).length) {
      res.status(400).send({
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
  } catch (error:any) {
    res.status(400).send({ message: error.message });
  }
};

export const deleteDepartmentById = async (req:Request, res:Response) => {
  try {
    const id = req.params.id;
    await departmentsService.deleteDepartmentById(id);
    res.status(200).send({
      message: "Department deleted successfully",
      deleted: true,
    });
  } catch (error:any) {
    res.status(400).send({ message: error.message });
  }
};
