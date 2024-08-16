const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const UserService = require("../service/UserService");
const userService = new UserService(process.env.DATA_BASE);

const strategyOptions = {
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true,
};

passport.use(
  "register",
  new LocalStrategy(strategyOptions, async (req, username, password, done) => {
    try {
      const { name, surname, phoneNumber, address } = req.body;

      const userStored = await userService.getUserById(username);
      if (!userStored) {
        return done(null, false, {
          code: 404,
          message: "Email not found for pending registration",
        });
      }
      if (userStored.isRegistered) {
        return done(null, false, {
          code: 409,
          message: "This email is already registrated",
        });
      }
      if (password.length < 8) {
        return done(null, false, {
          code: 400,
          message: "The password must be at least 8 characters",
        });
      }
      const user = {
        ...userStored,
        id: username,
        username: username,
        name,
        surname,
        phoneNumber,
        address,
        password: await bcrypt.hash(password, 10),
        isRegistered: true,
        validationToken: null,
      };

      const registeredUser = await userService.updateUserById(username, user);

      return done(null, {
        userId: registeredUser.id,
        name: registeredUser.name,
        role: userStored.role,
        permissions: userStored.permissions,
      });
    } catch (error) {
      let codeStatus = 400;
      if (error.message === `there is no document with id: ${username}`) {
        codeStatus = 404;
      }
      return done(null, false, { code: codeStatus, message: error.message });
    }
  })
);

passport.use(
  "login",
  new LocalStrategy(strategyOptions, async (req, username, password, done) => {
    try {
      const userStored = await userService.getUserById(username);
      if (!userStored) {
        return done(null, false, {
          code: 404,
          message: "User not found",
        });
      }
      if (!userStored.isRegistered) {
        return done(null, false, {
          code: 409,
          message: "User did not complete email validation",
        });
      }
      const passwordMatch = await bcrypt.compare(password, userStored.password);
      if (!passwordMatch) {
        return done(null, false, {
          code: 400,
          message: "Incorrect password",
        });
      }
      return done(null, {
        userId: userStored.id,
        name: userStored.name,
        role: userStored.role,
        permissions: userStored.permissions,
      });
    } catch (error) {
      let codeStatus = 400;
      if (error.message === `there is no document with id: ${username}`) {
        codeStatus = 404;
        error.message = "User not found";
      }
      return done(null, false, { code: codeStatus, message: error.message });
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await userService.getUserById(id);
    user.username = user.name;
    delete user.password;
    done(null, user);
  } catch (error) {
    throw new Error(error.message);
  }
});

module.exports = passport;
