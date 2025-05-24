import express from "express";
import * as authController from "../controllers/authController";
import verifyJWT from "../middlewares/verifyJWT" ;

const AuthRouter = express.Router();

AuthRouter.post("/register", authController.register);

AuthRouter.post("/login", authController.login);

AuthRouter.post("/googleLogin", authController.googleLogin); //

AuthRouter.get("/me", verifyJWT, authController.getJWT);

AuthRouter.get("/validation", authController.validateUser);

AuthRouter.get(
  "/send-link-reset-password",
  authController.sendLinkResetPassword
);

export default AuthRouter;
