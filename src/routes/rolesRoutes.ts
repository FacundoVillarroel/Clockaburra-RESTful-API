import express from "express";

import * as rolesController from "../controllers/rolesController";

const RolesRouter = express.Router();

RolesRouter.get("/", rolesController.getRoles);

RolesRouter.get("/:id", rolesController.getRoleById);

RolesRouter.post("/", rolesController.postNewRole);

RolesRouter.put("/:id", rolesController.modifyRoleById);

RolesRouter.delete("/:id", rolesController.deleteRoleById);

export default RolesRouter;
