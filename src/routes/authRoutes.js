const express = require("express");

const AuthRouter = express.Router();
const authController = require("../controllers/authController");

const verifyJWT = require("../middlewares/verifyJWT");

AuthRouter.post("/register", authController.register);

AuthRouter.post("/login", authController.login);

AuthRouter.post("/forgot-password", authController.forgotPassword);

AuthRouter.post("/reset-password", authController.resetPassword);

AuthRouter.get("/me", verifyJWT, authController.getJWT);

module.exports = AuthRouter;
