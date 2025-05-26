import passport from "../config/PassportConfig";
import jwt from "jsonwebtoken";
import axios from "axios";
import { sendResetPasswordEmail } from "../utils/emailHelperFunctions";
import type { Request, Response, NextFunction } from "express";
import type { AuthenticatedUser } from "../models/users/types/AuthenticatedUser";
import type { AuthenticatedRequest } from "../middlewares/verifyJWT";
import { AppError } from "../errors/AppError";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "../errors/HttpErrors";

if (
  process.env.DATA_BASE === undefined ||
  process.env.DATA_BASE !== "firebase"
) {
  throw new Error(
    "DATA_BASE environment variable is not defined or is not set to 'firebase'"
  );
}

import UserService from "../service/UserService";
const userService = new UserService(process.env.DATA_BASE);

const secretKey = process.env.JWT_SECRET;
if (!secretKey) {
  throw new Error("JWT_SECRET environment variable is not defined");
}

const secretKeyValidation = process.env.JWT_VALIDATION_LINK_SECRET;
if (!secretKeyValidation) {
  throw new Error(
    "JWT_VALIDATION_LINK_SECRET environment variable is not defined"
  );
}

export const register = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    "register",
    (
      error: AppError,
      user: AuthenticatedUser | false,
      info: AppError | undefined
    ) => {
      if (error) {
        return next(error);
      }
      if (!user) {
        if (!info) {
          res.status(500).send({ message: "Unknown error" });
          return;
        }

        res.status(info.statusCode).send({ message: info.message });
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
      error: AppError,
      user: AuthenticatedUser | false,
      info: AppError | undefined
    ) => {
      if (error) {
        return next(error);
      }
      if (!user) {
        if (!info) {
          res.status(500).send({ message: "Unknown error" });
          return;
        }
        res.status(info.statusCode).send({ message: info.message });
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

export const googleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { accessToken } = req.body;
    const response = await axios.get(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${accessToken}`
    );
    if (response.data.email_verified) {
      const email = response.data.email;
      const user = await userService.getUserById(email);

      if (!user) {
        next(new NotFoundError("User"));
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
      next(new BadRequestError("Could not authenticate Google account."));
    }
  } catch (error: unknown) {
    error instanceof Error
      ? console.error(error.message)
      : console.error(error);
    next(new InternalServerError("Internal server error"));
  }
};

export const validateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "TokenExpiredError") {
          next(
            new BadRequestError(
              "Token has expired. Please request a new activation link."
            )
          );
          return;
        } else if (error.name === "JsonWebTokenError") {
          next(
            new BadRequestError(
              "Invalid token. Please check the activation link or request a new one."
            )
          );
          return;
        } else {
          next(
            new InternalServerError(
              "An error occurred during token validation. Please try again later."
            )
          );
          return;
        }
      }
    }
    // At this point Token was validated by JWT, now need to be validated with token stored in user in the DB
    if (!decoded || typeof decoded !== "object") {
      next(
        new BadRequestError(
          "Invalid token. Please check the activation link or request a new one."
        )
      );
      return;
    }
    const { userId, userName, role, permissions } = decoded;
    const user = await userService.getUserById(userId);
    if (!user) {
      next(new NotFoundError("User"));
      return;
    }
    if (user.isRegistered) {
      next(
        new BadRequestError("This email is already registered and validated")
      );
    } else {
      if (user.validationToken === token) {
        res.send({
          message: "Valid Token",
          ok: true,
          user: { userId, userName, role, permissions },
        });
      } else {
        next(
          new BadRequestError(
            "Invalid token. Please check the activation link or request a new one."
          )
        );
      }
    }
  } catch (error) {
    next(
      error instanceof AppError
        ? error
        : new InternalServerError("Internal server error")
    );
  }
};

export const sendLinkResetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email } = req.query;
  if (!email || typeof email !== "string") {
    next(new BadRequestError("Email as string is required"));
    return;
  }
  try {
    const user = await userService.getUserById(email);
    if (!user) {
      next(new NotFoundError("User"));
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
  } catch (error: unknown) {
    if (error instanceof AppError && error.statusCode === 404) {
      next(new NotFoundError("User"));
    } else {
      console.error("AuthController: ", error);
      next(new InternalServerError("Internal server error"));
    }
  }
};
