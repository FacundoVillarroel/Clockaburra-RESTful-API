const express = require("express");

const AuthRouter = express.Router();
const authController = require("../controllers/authController");

AuthRouter.post("/register", authController.register);

AuthRouter.post("/login", authController.login);

AuthRouter.post("/logout", authController.logout);

AuthRouter.post("/forgot-password", authController.forgotPassword);

AuthRouter.post("/reset-password", authController.resetPassword);

AuthRouter.get("/me", authController.getJWT);

AuthRouter.put("/me", authController.editJWT);

module.exports = AuthRouter;
