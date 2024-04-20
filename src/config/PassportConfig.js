const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const strategyOptions = {
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true,
};

passport.use(
  "register",
  new LocalStrategy(strategyOptions, async (req, username, password, done) => {
    const { name, surname, phoneNumber, address } = req.body;
    const user = {
      id: username,
      username: username,
      name,
      surname,
      phoneNumber,
      address,
      password: await bcrypt.hash(password, 10),
    };

    // Simula una llamada a la base de datos para verificar si el usuario ya está registrado
    const userExists = checkUserExistsInDatabase(username);

    if (userExists) {
      return done(null, false, { message: "This email is already in use" });
    }

    // Validar la contraseña para asegurarse de que tenga al menos 8 caracteres
    if (password.length < 8) {
      return done(null, false, {
        message: "The password must be at least 8 characters",
      });
    }

    //Guardar usuario en base de datos

    return done(null, user);
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  // Simulación de búsqueda de usuario en la base de datos por ID
  const user = { id: 1, username: "admin" };
  done(null, user);
});

module.exports = passport;

const checkUserExistsInDatabase = (email) => {
  return false;
};
