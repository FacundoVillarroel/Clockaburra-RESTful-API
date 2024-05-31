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
      return res.status(400).send({ message: info.message });
    }
    const token = jwt.sign(
      { userId: user.id, userName: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );
    res
      .header("Authorization", "Bearer " + token)
      .status(201)
      .send({
        message: "Register successful",
        userId: user.userId,
        userName: user.name,
      });
  })(req, res, next);
};

exports.login = (req, res, next) => {
  passport.authenticate("login", (error, user, info) => {
    if (error) {
      return next(error);
    }
    if (!user) {
      return res.status(400).send({ message: info.message });
    }
    const token = jwt.sign(
      { userId: user.userId, userName: user.name },
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
  });
};
