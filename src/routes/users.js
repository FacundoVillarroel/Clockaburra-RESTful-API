const express = require("express");

const usersController = require("../controllers/users");

const usersRouter = express.Router();

//traer todos los empleados
usersRouter.get("/", usersController.getUsers);

//crear un empleado
usersRouter.post("/", usersController.postUsers);

//traer un empleado
usersRouter.get("/:id", usersController.getUser);

//modificar un empleado
usersRouter.put("/:id", usersController.putUser);

//eliminar un empleado
usersRouter.delete("/:id", usersController.deleteUser);

module.exports = usersRouter;
