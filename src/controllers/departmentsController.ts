import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { BadRequestError, InternalServerError } from "../errors/HttpErrors";
import type Department from "../models/departments/types/Department";

if (
  process.env.DATA_BASE === undefined ||
  process.env.DATA_BASE !== "firebase"
) {
  throw new Error(
    "DATA_BASE environment variable is not defined or is not set to 'firebase'"
  );
}

const DepartmentsService = require("../service/DepartmentsService").default;
const departmentsService = new DepartmentsService(process.env.DATA_BASE);

export const getDepartments = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const departments = await departmentsService.getDepartments();
    res.send(departments);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new InternalServerError());
    }
  }
};

export const getDepartmentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const department = await departmentsService.getDepartmentById(id);
    res.send(department);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new InternalServerError());
    }
  }
};

export const postNewDepartment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const department: Department = {
      name: req.body.name,
      description: req.body.description,
    };
    if (!department.name) {
      next(new BadRequestError("Department Name can not be empty"));
      return;
    }
    const response = await departmentsService.addDepartment(department);
    res.status(201).send({
      message: "department created successfully",
      ...response,
    });
  } catch (error: unknown) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new InternalServerError());
    }
  }
};

export const modifyDepartmentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const departmentUpdate = req.body;
    if (!Object.keys(departmentUpdate).length) {
      next(new BadRequestError("No properties to update provided"));
      return;
    } else {
      await departmentsService.updateDepartmentById(id, departmentUpdate);
      res.send({
        message: "Department updated successfully",
        updated: true,
        updatedDepartment: { id: id, ...departmentUpdate },
      });
    }
  } catch (error: unknown) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new InternalServerError());
    }
  }
};

export const deleteDepartmentById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    await departmentsService.deleteDepartmentById(id);
    res.status(204).send({
      message: "Department deleted successfully",
      deleted: true,
    });
  } catch (error: unknown) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new InternalServerError());
    }
  }
};
