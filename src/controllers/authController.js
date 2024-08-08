const passport = require("../config/PassportConfig");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserService = require("../service/UserService");
const userService = new UserService(process.env.DATA_BASE);

exports.register = (req, res, next) => {
  passport.authenticate("register", (error, user, info) => {
    if (error) {
      return next(error);
    }
    if (!user) {
      return res.status(info.code || 400).send({ message: info.message });
    }
    const token = jwt.sign(
      { userId: user.id, userName: user.name, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );
    res
      .header("Authorization", "Bearer " + token)
      .status(201)
      .send({
        message: "Successful registration",
        userId: user.userId,
        userName: user.name,
        role: user.role,
      });
  })(req, res, next);
};

exports.login = (req, res, next) => {
  passport.authenticate("login", (error, user, info) => {
    if (error) {
      return next(error);
    }
    if (!user) {
      return res.status(info.code || 400).send({ message: info.message });
    }
    const token = jwt.sign(
      { userId: user.userId, userName: user.name, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );
    res.header("Authorization", "Bearer " + token);
    res.send({
      message: "Login successful",
      userId: user.userId,
      userName: user.name,
      role: user.role,
    });
  })(req, res, next);
};

exports.resetPassword = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const userStored = await userService.getUserById(userId);
    if (!userStored) {
      throw new Error(`No user with id ${userId}`);
    }
    if (req.body.newPassword.length < 8) {
      throw new Error("The password must be at least 8 characters");
    }
    const newPassword = await bcrypt.hash(req.body.newPassword, 10);
    await userService.updateUserById(userId, { password: newPassword });
    res.send({ message: "Password updated", updated: true });
  } catch (error) {
    res.status(400).send({ message: error.message, updated: false });
  }
};

exports.getJWT = async (req, res, next) => {
  res.send({
    message: "Token information",
    userName: req.userName,
    userId: req.userId,
    role: req.role,
  });
};

exports.validateUser = async (req, res, next) => {
  try {
    let decoded;
    const secretKey = process.env.JWT_VALIDATION_LINK_SECRET;
    const { token } = req.query;
    // Handling errors jwt specific
    try {
      decoded = jwt.verify(token, secretKey);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        return res.status(400).send({
          message: "Token has expired. Please request a new activation link.",
          ok: false,
        });
      } else if (error.name === "JsonWebTokenError") {
        return res.status(400).send({
          message:
            "Invalid token. Please check the activation link or request a new one.",
          ok: false,
        });
      } else {
        return res.status(400).send({
          message:
            "An error occurred during token validation. Please try again later.",
          ok: false,
        });
      }
    }
    // At this point Token was validated by JWT, now needs to be validated with token stored in user in the DB
    const { userId, userName, role } = decoded;
    const user = await userService.getUserById(userId);
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
          user: { userId, userName, role },
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
