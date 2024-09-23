const express = require("express");

const usersController = require("../controllers/usersController");

const UsersRouter = express.Router();

UsersRouter.get("/", usersController.getUsers);

UsersRouter.post("/", usersController.postUsers);

UsersRouter.get("/:id", usersController.getUser);

UsersRouter.put(
  "/resend-validation-link/:id",
  usersController.resendValidationLink
);

UsersRouter.put("/reset-password", usersController.resetPassword);

UsersRouter.put("/:id", usersController.putUser);

UsersRouter.delete("/:id", usersController.deleteUser);

module.exports = UsersRouter;
