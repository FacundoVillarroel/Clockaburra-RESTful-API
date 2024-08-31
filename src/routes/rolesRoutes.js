const express = require("express");

const rolesController = require("../controllers/rolesController");

const RolesRouter = express.Router();

RolesRouter.get("/", rolesController.getRoles);

RolesRouter.get("/:id", rolesController.getRoleById);

RolesRouter.post("/", rolesController.postNewRole);

RolesRouter.put("/:id", rolesController.modifyRoleById);

RolesRouter.delete("/:id", rolesController.deleteRoleById);

module.exports = RolesRouter;
