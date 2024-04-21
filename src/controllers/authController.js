const passport = require("../config/PassportConfig");

exports.register = (req, res, next) => {
  passport.authenticate("register", (error, user, info) => {
    if (error) {
      return next(error);
    }
    if (!user) {
      return res.status(400).send({ message: info.message });
    }
    req.logIn(user, (error) => {
      if (error) {
        return next(error);
      }
      return res
        .status(201)
        .send({ message: "Register successful", user: user });
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
    req.logIn(user, (error) => {
      if (error) {
        return next(error);
      }
      return res.status(200).send({ message: "Login successful", user: user });
    });
  })(req, res, next);
};

exports.logout = async (req, res, next) => {
  req.logout(() => {});
  res.status(200).send({ message: "Logout successful" });
};
exports.forgotPassword = async (req, res, next) => {
  res.send({ message: "Forgot password" });
};
exports.resetPassword = async (req, res, next) => {
  res.send({ message: "Reset password" });
};
exports.getJWT = async (req, res, next) => {
  if (req.isAuthenticated()) {
    res.send("Welcome " + req.user.username);
  } else {
    res.send({ message: "No user logged in" });
  }
};
exports.editJWT = async (req, res, next) => {
  res.send({ message: "Edit JWT" });
};
