import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { AppError } from "../errors/AppError";
import { BadRequestError, InternalServerError, NotFoundError } from "../errors/HttpErrors";
import type { Request, Response, NextFunction } from "express";

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
import ClockService from "../service/ClockService";
const clockService = new ClockService(process.env.DATA_BASE);

const secretKey = process.env.JWT_VALIDATION_LINK_SECRET;

if (!secretKey) {
  throw new Error(
    "JWT_VALIDATION_LINK_SECRET environment variable is not defined"
  );
}

import {
  sendRegistrationEmail,
  isValidEmail,
} from "../utils/emailHelperFunctions";

import { isValidDate } from "../utils/dateHelperFunctions";
import type User from "../models/users/types/User";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { roles, departments } = req.query;

    const rolesArray =
      typeof roles === "string"
        ? roles.split(",")
        : Array.isArray(roles)
        ? roles.flatMap((role) =>
            typeof role === "string" ? role.split(",") : []
          )
        : [];

    const departmentsArray =
      typeof departments === "string"
        ? departments.split(",")
        : Array.isArray(departments)
        ? departments.flatMap((dep) =>
            typeof dep === "string" ? dep.split(",") : []
          )
        : [];

    const filters = { roles: rolesArray, departments: departmentsArray };
    const users = await userService.getUsers(filters);
    res.status(200).send(users);
  } catch (error: unknown) {
    console.error("UserController", error);
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new InternalServerError());
    }
  }
};

export const postUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (isNaN(parseFloat(req.body.hourlyRate))) {
      next(new BadRequestError("hourlyRate must be a Number"));
      return;
    }
    if (!isValidEmail(req.body.email)) {
      next(new BadRequestError("The Email is invalid"));
      return;
    }

    const token = jwt.sign(
      {
        userName: req.body.name,
        userId: req.body.email,
        role: req.body.role,
        permissions: req.body.permissions,
      },
      secretKey,
      {
        expiresIn: "3d",
      }
    );
    const user: User = {
      id: req.body.email,
      email: req.body.email,
      name: req.body.name,
      surname: req.body.surname,
      username: req.body.email,
      role: req.body.role,
      department: req.body.department,
      startDate: req.body.startDate,
      hourlyRate: parseFloat(req.body.hourlyRate),
      permissions: req.body.permissions,
      isRegistered: false,
      validationToken: token,
    };
    if (!isValidDate(user.startDate)) {
      next(new BadRequestError("Date entered is invalid"));
      return;
    }
    const hasEmptyValue = Object.entries(user).some(([key, value]) => {
      if (
        key === "isRegistered" ||
        typeof value === "boolean" ||
        key === "validationToken"
      ) {
        return false;
      }
      if (key === "hourlyRate" && value === 0) {
        return false;
      }
      return !value;
    });

    if (hasEmptyValue) {
      next(new BadRequestError("Missing properties for this user"));
      return;
    } else {
      const response = await userService.addUser(user);
      await clockService.createClockForNewUser(user.id);

      const emailResponse = await sendRegistrationEmail(
        user.email,
        user.name,
        token
      );
      console.log("'userController' Email sent status:", emailResponse.status); //emailResponse.status === "success" ? "user created sucessfully : "error sending registration email"
      res.status(201).send({
        message: "User created successfully",
        ...response,
      });
    }
  } catch (error: unknown) {
    console.error("UserController", error);
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new InternalServerError());
    }
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const user = await userService.getUserById(id);
    const safeUser = {
      ...user,
    };
    delete (safeUser as any).password;
    res.send({ user: safeUser });
  } catch (error: unknown) {
    console.error("UserController", error);
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new InternalServerError());
    }
  }
};

export const putUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const userUpdate = req.body;
    if (!Object.keys(userUpdate).length) {
      next(new BadRequestError("No properties to update"));
      return;
    } else {
      const response = await userService.updateUserById(id, userUpdate);
      res.send({
        message: "User updated successfully",
        updated: true,
        updatedUser: response,
      });
    }
  } catch (error: unknown) {
    console.error("UserController", error);
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new InternalServerError());
    }
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    await userService.deleteUserById(id);
    const clock = await clockService.getStatusByUserId(id);
    await clockService.deleteClockByUserId(clock.id);
    res.status(204).send({ message: "User deleted successfully", deleted: true });
  } catch (error: unknown) {
    console.error("UserController", error);
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new InternalServerError());
    }
  }
};

export const resendValidationLink = async (req:Request, res:Response, next:NextFunction) => {
  try {
    const id = req.params.id;
    const newToken = jwt.sign(
      {
        userName: req.body.name,
        userId: id,
        role: req.body.role,
        permissions: req.body.permissions,
      },
      secretKey,
      {
        expiresIn: "3d",
      }
    );
    const response = await userService.updateUserById(id, {
      validationToken: newToken,
    });
    await sendRegistrationEmail(id, req.body.name, newToken);
    res.send({
      message: "New validation link sent successfully.",
      ok: true,
      updatedUser: response,
    });
  } catch (error:unknown) {
    console.error("UserController", error);
    if (error instanceof AppError) {
        next(error); 
      } else {
        next(new InternalServerError());
      }
  }
};

export const resetPassword = async (req:Request, res:Response, next:NextFunction) => {
  try {
    let decoded;
    const token = req.body.token;
    // Handling errors jwt specific
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        next(new BadRequestError("Token has expired. Please request a new activation link."));
        return;
      } else if (error.name === "JsonWebTokenError") {
        next(new BadRequestError("Invalid token. Please check the activation link or request a new one."));
        return;
      } else {
        next(new BadRequestError("Token Invalid."));
        return;
      }
    }
    // At this point Token was validated bys JWT, now need to be validated with token stored in user in the DB
    if (typeof decoded === "string") {
      next(new BadRequestError("Invalid token format."));
      return;
    }
    const userStored = await userService.getUserById(decoded.userId);
    if (!userStored) {
      next(new NotFoundError(`No user with id ${decoded.userId}`));
      return
    }
    if (userStored.resetPasswordToken !== token) {
      next(new BadRequestError("The link is either expired or wrong, please ask for a new one."));
      return
    }
    if (req.body.password.length < 8) {
      next(new BadRequestError("The password must be at least 8 characters"));
      return
    }
    const newPassword = await bcrypt.hash(req.body.password, 10);
    await userService.updateUserById(decoded.userId, {
      password: newPassword,
      resetPasswordToken: null,
      isRegistered: true,
    });
    res.send({ message: "Password updated", updated: true });
  } catch (error:unknown) {
    console.error("UserController", error);
    if (error instanceof AppError) {
        next(error); 
      } else {
        next(new InternalServerError());
      }
  }
};
