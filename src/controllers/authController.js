const passport = require("../config/PassportConfig");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const UserService = require("../service/UserService");
const userService = new UserService(process.env.DATA_BASE);

const { sendResetPasswordEmail } = require("../utils/emailHelperFunctions");
const secretKey = process.env.JWT_SECRET;
const secretKeyValidation = process.env.JWT_VALIDATION_LINK_SECRET;

exports.register = (req, res, next) => {
  passport.authenticate("register", (error, user, info) => {
    if (error) {
      return next(error);
    }
    if (!user) {
      return res.status(info.code || 400).send({ message: info.message });
    }
    const token = jwt.sign(
      {
        userId: user.id,
        userName: user.name,
        role: user.role,
        permissions: user.permissions,
      },
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
        permissions: user.permissions,
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
      {
        userId: user.userId,
        userName: user.name,
        role: user.role,
        permissions: user.permissions,
      },
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
      permissions: user.permissions,
    });
  })(req, res, next);
};

exports.getJWT = async (req, res, next) => {
  res.send({
    message: "Token information",
    userName: req.userName,
    userId: req.userId,
    role: req.role,
    permissions: req.permissions,
  });
};

exports.validateUser = async (req, res, next) => {
  try {
    let decoded;
    const secretKeyValidation = process.env.JWT_VALIDATION_LINK_SECRET;
    const { token } = req.query;
    // Handling errors jwt specific
    try {
      decoded = jwt.verify(token, secretKeyValidation);
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
    // At this point Token was validated bys JWT, now need to be validated with token stored in user in the DB
    const { userId, userName, role, permissions } = decoded;
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

exports.sendLinkResetPassword = async (req, res, next) => {
  const { email } = req.query;
  try {
    const user = await userService.getUserById(email);
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
  } catch (error) {
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
