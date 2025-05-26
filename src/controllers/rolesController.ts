import type { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";
import { BadRequestError, InternalServerError } from "../errors/HttpErrors";

if (
  process.env.DATA_BASE === undefined ||
  process.env.DATA_BASE !== "firebase"
) {
  throw new Error(
    "DATA_BASE environment variable is not defined or is not set to 'firebase'"
  );
}

import RolesService from "../service/RolesService";
import type Role from "../models/roles/types/Role";
const rolesService = new RolesService(process.env.DATA_BASE);

export const getRoles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    /**
     * method description: get all the roles from db,
     * input variables: none
     * return: array with role objects
     */
    const roles = await rolesService.getRoles();
    res.send(roles);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new InternalServerError());
    }
  }
};

export const getRoleById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const role = await rolesService.getRoleById(id);
    res.send(role);
  } catch (error: unknown) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new InternalServerError());
    }
  }
};

export const postNewRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const role: Role = {
      name: req.body.name,
      description: req.body.description,
    };
    if (!role.name) {
      next(new BadRequestError("Role Name can not be empty"));
      return;
    } else {
      const response = await rolesService.addRole(role);
      res.status(201).send({
        message: "role created successfully",
        ...response,
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

export const modifyRoleById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const roleUpdate = req.body;
    if (!Object.keys(roleUpdate).length) {
      next(new BadRequestError("Role update can not be empty"));
      return;
    } else {
      await rolesService.updateRoleById(id, roleUpdate);
      res.send({
        message: "Role updated successfully",
        updated: true,
        updatedRole: { id: id, ...roleUpdate },
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

export const deleteRoleById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    await rolesService.deleteRoleById(id);
    res.status(204).send({
      message: "Role deleted successfully",
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
