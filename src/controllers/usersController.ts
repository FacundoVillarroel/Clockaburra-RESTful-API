import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import type { Request, Response } from "express";

if(process.env.DATA_BASE === undefined || process.env.DATA_BASE !== "firebase" ) {
  throw new Error("DATA_BASE environment variable is not defined or is not set to 'firebase'");
}

import UserService from "../service/UserService";
const userService = new UserService(process.env.DATA_BASE);
import ClockService from "../service/ClockService";
const clockService = new ClockService(process.env.DATA_BASE);

const secretKey = process.env.JWT_VALIDATION_LINK_SECRET;

if (!secretKey) {
  throw new Error("JWT_VALIDATION_LINK_SECRET environment variable is not defined");
}

import { sendRegistrationEmail, isValidEmail,} from "../utils/emailHelperFunctions";

import { isValidDate } from "../utils/dateHelperFunctions"
import type User from "../models/users/types/User";

export const getUsers = async (req:Request, res:Response) => {
  try {
    const { roles, departments } = req.query;
    
    const rolesArray = typeof roles === 'string'
      ? roles.split(',')
      : Array.isArray(roles)
        ? roles.flatMap(role => typeof role === 'string' ? role.split(',') : [])
        : [];
    
    const departmentsArray = typeof departments === 'string'
      ? departments.split(',')
      : Array.isArray(departments)
        ? departments.flatMap(dep => typeof dep === 'string' ? dep.split(',') : [])
        : [];

    const filters = { roles:rolesArray, departments:departmentsArray };
    const users = await userService.getUsers(filters);
    res.status(200).send(users);
  } catch (error) {
    console.error("UserController", error);
  }
};

export const postUsers = async (req: Request, res:Response) => {
  try {
    if (isNaN(parseFloat(req.body.hourlyRate))) {
      throw new Error("hourlyRate must be a Number");
    }
    if (!isValidEmail(req.body.email)) {
      throw new Error("The Email is invalid");
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
      throw new Error("Date entered is invalid");
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
      res.status(422).send({ message: "missing properties for this user" });
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
  } catch (error:any) {
    console.error("UserController", error);
    res.status(409).send({ message: error.message });
  }
};

export const getUser = async (req:Request, res:Response) => {
  try {
    const id = req.params.id;
    const user = await userService.getUserById(id);
    const safeUser = {
      ...user
    };
    delete (safeUser as any).password;
    res.send({ user:safeUser });
  } catch (error:any) {
    console.error("UserController", error);
    res.status(404).send(error.message);
  }
};

export const putUser = async (req:Request, res:Response) => {
  try {
    const id = req.params.id;
    const userUpdate = req.body;
    if (!Object.keys(userUpdate).length)
      res
        .status(400)
        .send({ message: "Missing properies for the user", updated: false });
    else {
      const response = await userService.updateUserById(id, userUpdate);
      res.send({
        message: "User updated successfully",
        updated: true,
        updatedUser: response,
      });
    }
  } catch (error:any) {
    console.error("UserController", error);
    if (error.message === `there is no document with id: ${req.params.id}`) {
      res.status(404).send({ message: error.message, updated: false });
    } else {
      res.status(400).send({ message: error.message, updated: false });
    }
  }
};

export const deleteUser = async (req:Request, res:Response) => {
  try {
    const id = req.params.id;
    await userService.deleteUserById(id);
    const clock = await clockService.getStatusByUserId(id);
    await clockService.deleteClockByUserId(clock.id);
    res
      .status(200)
      .send({ message: "User deleted successfully", deleted: true });
  } catch (error:any) {
    console.error("UserController", error);
    res.status(404).send({ message: error.message, deleted: false });
  }
};

export const resendValidationLink = async (req:Request, res:Response) => {
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
  } catch (error:any) {
    console.error("UserController", error);
    res.status(404).send({ message: error.message, ok: false });
  }
};

export const resetPassword = async (req:Request, res:Response) => {
  try {
    let decoded;
    const token = req.body.token;
    // Handling errors jwt specific
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        res.status(400).send({
          message: "Token has expired. Please request a new activation link.",
          updated: false,
        });
        return;
      } else if (error.name === "JsonWebTokenError") {
        res.status(400).send({
          message:
            "Invalid token. Please check the activation link or request a new one.",
          updated: false,
        });
        return;
      } else {
        res.status(400).send({
          message:
            "An error occurred during token validation. Please try again later.",
          updated: false,
        });
        return;
      }
    }
    // At this point Token was validated bys JWT, now need to be validated with token stored in user in the DB
    if (typeof decoded === "string") {
      res.status(400).send({
        message:
          "Invalid token. Please check the activation link or request a new one.",
        updated: false,
      });
      return;
    }
    const userStored = await userService.getUserById(decoded.userId);
    if (!userStored) {
      throw new Error(`No user with id ${decoded.userId}`);
    }
    if (userStored.resetPasswordToken !== token) {
      throw new Error(
        "The link is either expired or wrong, please ask for a new link."
      );
    }
    if (req.body.password.length < 8) {
      throw new Error("The password must be at least 8 characters");
    }
    const newPassword = await bcrypt.hash(req.body.password, 10);
    await userService.updateUserById(decoded.userId, {
      password: newPassword,
      resetPasswordToken: null,
      isRegistered: true,
    });
    res.send({ message: "Password updated", updated: true });
  } catch (error:any) {
    console.error("UserController", error);
    res.status(400).send({ message: error.message, updated: false });
  }
};
