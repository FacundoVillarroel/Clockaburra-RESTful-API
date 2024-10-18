const express = require("express");

const AuthRouter = express.Router();
const authController = require("../controllers/authController");

const verifyJWT = require("../middlewares/verifyJWT");

AuthRouter.post("/register", authController.register);

AuthRouter.post("/login", authController.login);

AuthRouter.post("/googleLogin", authController.googleLogin); //

AuthRouter.get("/me", verifyJWT, authController.getJWT);

AuthRouter.get("/validation", authController.validateUser);

AuthRouter.get(
  "/send-link-reset-password",
  authController.sendLinkResetPassword
);

module.exports = AuthRouter;
