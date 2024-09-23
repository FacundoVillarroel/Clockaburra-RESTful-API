const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserService = require("../service/UserService");
const userService = new UserService(process.env.DATA_BASE);
const ClockService = require("../service/ClockService");
const clockService = new ClockService(process.env.DATA_BASE);

const secretKey = process.env.JWT_VALIDATION_LINK_SECRET;

const {
  sendRegistrationEmail,
  isValidEmail,
} = require("../utils/emailHelperFunctions");
const { isValidDate } = require("../utils/dateHelperFunctions");

exports.getUsers = async (req, res, next) => {
  try {
    const roles = req.query.roles?.split(",") || []; //must be an array
    const departments = req.query.departments?.split(",") || []; //must be an array
    const filters = { roles, departments };
    const users = await userService.getUsers(filters);
    res.status(200).send(users);
  } catch (error) {
    console.error("UserController", error);
  }
};

exports.postUsers = async (req, res, next) => {
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
    const user = {
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
  } catch (error) {
    console.error("UserController", error);
    res.status(409).send({ message: error.message });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await userService.getUserById(id);
    delete user.password;
    res.send({ user });
  } catch (error) {
    console.error("UserController", error);
    res.status(404).send(error.message);
  }
};

exports.putUser = async (req, res, next) => {
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
  } catch (error) {
    console.error("UserController", error);
    if (error.message === `there is no document with id: ${req.params.id}`) {
      res.status(404).send({ message: error.message, updated: false });
    } else {
      res.status(400).send({ message: error.message, updated: false });
    }
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    await userService.deleteUserById(id);
    const clock = await clockService.getStatusByUserId(id);
    await clockService.deleteClockByUserId(clock.id);
    res
      .status(200)
      .send({ message: "User deleted successfully", deleted: true });
  } catch (error) {
    console.error("UserController", error);
    res.status(404).send({ message: error.message, deleted: false });
  }
};

exports.resendValidationLink = async (req, res, next) => {
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
  } catch (error) {
    console.error("UserController", error);
    res.status(404).send({ message: error.message, ok: false });
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    let decoded;
    const secretKey = process.env.JWT_SECRET;
    const token = req.body.token;
    // Handling errors jwt specific
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).send({
          message: "Token has expired. Please request a new activation link.",
          updated: false,
        });
      } else if (error.name === "JsonWebTokenError") {
        return res.status(400).send({
          message:
            "Invalid token. Please check the activation link or request a new one.",
          updated: false,
        });
      } else {
        return res.status(400).send({
          message:
            "An error occurred during token validation. Please try again later.",
          updated: false,
        });
      }
    }
    // At this point Token was validated bys JWT, now need to be validated with token stored in user in the DB
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
  } catch (error) {
    console.error("UserController", error);
    res.status(400).send({ message: error.message, updated: false });
  }
};
