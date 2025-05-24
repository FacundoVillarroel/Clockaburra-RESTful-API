import passport from "../config/PassportConfig";
import jwt from "jsonwebtoken";
import axios from "axios";
import { sendResetPasswordEmail } from "../utils/emailHelperFunctions";
import type { Request, Response, NextFunction } from "express";
import type { AuthErrorInfo } from "../config/PassportConfig";
import type { AuthenticatedUser } from "../models/users/types/AuthenticatedUser";
import type { AuthenticatedRequest } from "../middlewares/verifyJWT";

if(process.env.DATA_BASE === undefined || process.env.DATA_BASE !== "firebase" ) {
  throw new Error("DATA_BASE environment variable is not defined or is not set to 'firebase'");
}

import UserService from "../service/UserService";
const userService = new UserService(process.env.DATA_BASE);

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

const secretKeyValidation = process.env.JWT_VALIDATION_LINK_SECRET;
if (!secretKeyValidation) {
  throw new Error("JWT_VALIDATION_LINK_SECRET environment variable is not defined");
}

export const register = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "register",
    (
      error: AuthErrorInfo,
      user: AuthenticatedUser | false,
      info: AuthErrorInfo | undefined
    ) => {
      if (error) {
        return next(error);
      }
      if (!user) {
        let errorCode = 400;
        if (!info) {
          res.status(500).send({ message: "Unknown error" });
          return;
        }
        switch (info.message) {
          case "Email not found for pending registration":
            errorCode = 404;
            break;
          case "This email is already registrated":
            errorCode = 409;
            break;
          case "The password must be at least 8 characters":
            errorCode = 400;
        }
        res.status(errorCode).send({ message: info.message });
        return;
      }
      const token = jwt.sign(
        {
          userId: user.userId,
          userName: user.name,
          role: user.role,
          permissions: user.permissions,
        },
        secretKey,
        {
          expiresIn: "1w",
        }
      );
      res.header("Authorization", "Bearer " + token);
      res.setHeader("Access-Control-Expose-Headers", "Authorization");
      res.status(201).send({
        message: "Successful registration",
        userId: user.userId,
        userName: user.name,
        role: user.role,
        permissions: user.permissions,
      });
    }
  )(req, res, next);
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "login",
    (
      error: AuthErrorInfo,
      user: AuthenticatedUser | false,
      info: AuthErrorInfo | undefined
    ) => {
      if (error) {
        return next(error);
      }
      if (!user) {
        let errorCode = 400;
        if (!info) {
          res.status(500).send({ message: "Unknown error" });
          return;
        }
        switch (info.message) {
          case "User not found":
            errorCode = 404;
            break;
          case "User did not complete email validation":
            errorCode = 409;
            break;
          case "Incorrect password":
            errorCode = 400;
        }
        res.status(errorCode).send({ message: info.message });
        return;
      }
      const token = jwt.sign(
        {
          userId: user.userId,
          userName: user.name,
          role: user.role,
          permissions: user.permissions,
        },
        secretKey,
        {
          expiresIn: "1w",
        }
      );
      res.header("Authorization", "Bearer " + token);
      res.setHeader("Access-Control-Expose-Headers", "Authorization");
      res.send({
        message: "Login successful",
        userId: user.userId,
        userName: user.name,
        role: user.role,
        permissions: user.permissions,
      });
    }
  )(req, res, next);
};

export const getJWT = async (req: AuthenticatedRequest, res: Response) => {
  res.send({
    message: "Token information",
    userName: req.userName,
    userId: req.userId,
    role: req.role,
    permissions: req.permissions,
  });
};

export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.body;
    const response = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${accessToken}`
    );
    if (response.data.email_verified) {
      const email = response.data.email;
      const user = await userService.getUserById(email);

      if (!user) {
        res.status(404).send({
          message: "User not found",
          ok: false,
        });
        return;
      }

      const token = jwt.sign(
        {
          userId: user.email,
          userName: user.name,
          role: user.role,
          permissions: user.permissions,
        },
        secretKey,
        {
          expiresIn: "1w",
        }
      );
      res.header("Authorization", "Bearer " + token);
      res.setHeader("Access-Control-Expose-Headers", "Authorization");
      res.send({
        message: "Login successful",
        userId: user.email,
        userName: user.name,
        role: user.role,
        permissions: user.permissions,
      });
    } else {
      res
        .status(400)
        .send({ message: "Could not authenticate Google account." });
    }
  } catch (error: any) {
    console.error(error.message);
    res.status(400).send({ message: "Could not authenticate Google account." });
  }
};

export const validateUser = async (req: Request, res: Response) => {
  try {
    let decoded;

    const { token } = req.query;
    if (!token || typeof token !== "string") {
      res.status(400).send({
        message: "Token as string is required",
        ok: false,
      });
      return;
    }
    // Handling errors jwt specific
    try {
      decoded = jwt.verify(token, secretKeyValidation);
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        res.status(400).send({
          message: "Token has expired. Please request a new activation link.",
          ok: false,
        });
        return;
      } else if (error.name === "JsonWebTokenError") {
        res.status(400).send({
          message:
            "Invalid token. Please check the activation link or request a new one.",
          ok: false,
        });
        return;
      } else {
        res.status(400).send({
          message:
            "An error occurred during token validation. Please try again later.",
          ok: false,
        });
        return;
      }
    }
    // At this point Token was validated by JWT, now need to be validated with token stored in user in the DB
    if (!decoded || typeof decoded !== "object") {
      res.status(400).send({
        message:
          "Invalid token. Please check the activation link or request a new one.",
        ok: false,
      });
      return;
    }
    const { userId, userName, role, permissions } = decoded;
    const user = await userService.getUserById(userId);
    if (!user) {
      res.status(404).send({
        message: "User not found",
        ok: false,
      });
      return;
    }
    if (user.isRegistered) {
      res.status(400).send({
        message: `This email is already registered and validated`,
        ok: false,
      });
    } else {
      if (user.validationToken === token) {
        res.send({
          message: "Valid Token",
          ok: true,
          user: { userId, userName, role, permissions },
        });
      } else {
        res.status(400).send({
          message:
            "Invalid token. Please check the activation link or request a new one.",
          ok: false,
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      message: "Internal server error",
      ok: false,
    });
  }
};

export const sendLinkResetPassword = async (req: Request, res: Response) => {
  const { email } = req.query;
  if (!email || typeof email !== "string") {
    res.status(400).send({
      message: "Email as string is required",
      ok: false,
    });
    return;
  }
  try {
    const user = await userService.getUserById(email);
    if (!user) {
      res.status(404).send({
        message: "User not found",
        ok: false,
      });
      return;
    }
    const newToken = jwt.sign(
      {
        userName: user.name,
        userId: email,
        role: user.role,
        permissions: user.permissions,
      },
      secretKey,
      {
        expiresIn: "3d",
      }
    );
    const response = await userService.updateUserById(email, {
      resetPasswordToken: newToken,
    });
    console.log(response);
    await sendResetPasswordEmail(email, user.name, newToken);
    res.send({
      message: "Password reset link sent successfully to email.",
      ok: true,
      user: response,
    });
  } catch (error: any) {
    if (error.message === `there is no document with id: ${email}`) {
      res.status(404).send({
        message: "Email not registered in db",
        ok: false,
      });
    } else {
      console.error("AuthController: ", error.message);
      res.status(500).send({
        message: "Internal server error",
        ok: false,
      });
    }
  }
};
