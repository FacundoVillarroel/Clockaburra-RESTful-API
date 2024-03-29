const express = require("express");

const usersController = require("../controllers/users");

const UsersRouter = express.Router();

//traer todos los usuarios
UsersRouter.get("/", usersController.getUsers);

//crear un usuario
UsersRouter.post("/", usersController.postUsers);

//traer un usuario
UsersRouter.get("/:id", usersController.getUser);

//modificar un usuario
UsersRouter.put("/:id", usersController.putUser);

//eliminar un usuario
UsersRouter.delete("/:id", usersController.deleteUser);

module.exports = UsersRouter;
