import type { Request, Response } from "express";

if(process.env.DATA_BASE === undefined || process.env.DATA_BASE !== "firebase" ) {
  throw new Error("DATA_BASE environment variable is not defined or is not set to 'firebase'");
}

import RolesService from "../service/RolesService";
import Role from "../models/roles/types/Role";
const rolesService = new RolesService(process.env.DATA_BASE);

export const getRoles = async (req:Request, res:Response) => {
  try {
    /**
     * method description: get all the roles from db,
     * input variables: none
     * return: array with role objects
     */
    const roles = await rolesService.getRoles();
    res.send(roles);
  } catch (error:any) {
    res.status(400).send({ message: error.message });
  }
};

export const getRoleById = async (req:Request, res:Response) => {
  try {
    const id = req.params.id;
    const role = await rolesService.getRoleById(id);
    res.send(role);
  } catch (error:any) {
    res.status(400).send({ message: error.message });
  }
};

export const postNewRole = async (req:Request, res:Response) => {
  try {
    const role : Role = {
      name: req.body.name,
      description: req.body.description,
    };
    if (!role.name) {
      res.status(422).send({ message: "Role Name can not be empty" });
    } else {
      const response = await rolesService.addRole(role);
      res.status(201).send({
        message: "role created successfully",
        ...response,
      });
    }
  } catch (error:any) {
    res.status(400).send({ message: error.message });
  }
};

export const modifyRoleById = async (req:Request, res:Response) => {
  try {
    const id = req.params.id;
    const roleUpdate = req.body;
    if (!Object.keys(roleUpdate).length) {
      res.status(400).send({
        message: "role update can not be empty",
        updated: false,
      });
    } else {
      await rolesService.updateRoleById(id, roleUpdate);
      res.send({
        message: "Role updated successfully",
        updated: true,
        updatedRole: { id: id, ...roleUpdate },
      });
    }
  } catch (error:any) {
    res.status(400).send({ message: error.message });
  }
};

export const deleteRoleById = async (req:Request, res:Response) => {
  try {
    const id = req.params.id;
    await rolesService.deleteRoleById(id);
    res.status(200).send({
      message: "Role deleted successfully",
      deleted: true,
    });
  } catch (error:any) {
    res.status(400).send({ message: error.message });
  }
};
