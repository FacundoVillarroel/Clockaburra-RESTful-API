const passport = require("../config/PassportConfig");
const jwt = require("jsonwebtoken");

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
      .status(201)
      .send({ message: "Register successful", user: user, token: token });
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
      { userId: user.id, userName: user.name },
      process.env.JWT_SECRET,
      {
        expiresIn: "1w",
      }
    );
    res
      .status(200)
      .send({ message: "Login successful", user: user, token: token });
  })(req, res, next);
};

exports.forgotPassword = async (req, res, next) => {
  res.send({ message: "Forgot password" });
};

exports.resetPassword = async (req, res, next) => {
  res.send({ message: "Reset password" });
};

exports.getJWT = async (req, res, next) => {
  res.send({
    message: "Token information",
    userName: req.userName,
    userId: req.userId,
  });
};
