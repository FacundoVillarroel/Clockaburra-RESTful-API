const passport = require("../config/PassportConfig");

exports.register = (req, res, next) => {
  passport.authenticate("register", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).send({ message: info.message });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res
        .status(201)
        .send({ message: "Register successful", user: user });
    });
  })(req, res, next);
};

exports.login = async (req, res, next) => {
  res.send({ message: "Login" });
};
exports.logout = async (req, res, next) => {
  res.send({ message: "Logout" });
};
exports.forgotPassword = async (req, res, next) => {
  res.send({ message: "Forgot password" });
};
exports.resetPassword = async (req, res, next) => {
  res.send({ message: "Reset password" });
};
exports.getJWT = async (req, res, next) => {
  res.send({ message: "Get JWT" });
};
exports.editJWT = async (req, res, next) => {
  res.send({ message: "Edit JWT" });
};
