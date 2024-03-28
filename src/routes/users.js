const express = require("express");

const usersController = require("../controllers/users");

const usersRouter = express.Router();

//traer todos los usuarios
usersRouter.get("/", usersController.getUsers);

//crear un usuario
usersRouter.post("/", usersController.postUsers);

//traer un usuario
usersRouter.get("/:id", usersController.getUser);

//modificar un usuario
usersRouter.put("/:id", usersController.putUser);

//eliminar un usuario
usersRouter.delete("/:id", usersController.deleteUser);

module.exports = usersRouter;
