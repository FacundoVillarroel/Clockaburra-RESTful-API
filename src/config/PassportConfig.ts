import { Request } from "express";

import passport from "passport";
import { Strategy as LocalStrategy, IStrategyOptionsWithRequest } from "passport-local";
import bcrypt from "bcrypt";
// @ts-ignore
import UserService from "../service/UserService";
import type { User } from "../models/users/types/User";
import { AuthenticatedUser } from "../models/users/types/AuthenticatedUser";

const userService = new UserService(process.env.DATA_BASE);

interface AuthErrorInfo {
  message: string;
  code?: number;
}

const AuthErrors = {
  UserNotFound: (customMsg?: string) =>
    createAuthError(customMsg || "User not found", 404),
  AlreadyRegistered: createAuthError("This email is already registered", 400),
  PasswordTooShort: createAuthError(
    "The password must be at least 8 characters",
    400
  ),
  EmailNotPendingRegistration: createAuthError(
    "Email not found for pending registration",
    404
  ),
  EmailNotValidated: createAuthError(
    "User did not complete email validation",
    400
  ),
  IncorrectPassword: createAuthError("Incorrect password", 400),
  Unknown: createAuthError("Unknown error", 500),
};

function createAuthError(message: string, code = 400): AuthErrorInfo {
  return { message, code };
}

const strategyOptions: IStrategyOptionsWithRequest = {
  usernameField: "email",
  passwordField: "password",
  passReqToCallback: true,
};

passport.use(
  "register",
  new LocalStrategy(
    strategyOptions,
    async (req: Request, username, password, done) => {
      try {
        const { name, surname, phoneNumber, address } = req.body;

        const userStored: User | null = await userService.getUserById(username);
        if (!userStored) {
          return done(
            null,
            false,
            AuthErrors.EmailNotPendingRegistration as any
          );
        }
        if (userStored.isRegistered) {
          return done(done(null, false, AuthErrors.AlreadyRegistered as any));
        }
        if (password.length < 8) {
          return done(null, false, AuthErrors.PasswordTooShort as any);
        }
        const user: User = {
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
        } satisfies AuthenticatedUser);
      } catch (error) {
        let codeStatus = 400;

        if (
          error instanceof Error &&
          error.message === `there is no document with id: ${username}`
        ) {
          return done(
            null,
            false,
            AuthErrors.EmailNotPendingRegistration as any
          );
        }

        const message =
          error instanceof Error ? error.message : "Unknown error";
        return done(null, false, createAuthError(message, codeStatus) as any);
      }
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(strategyOptions, async (req, username, password, done) => {
    try {
      const userStored : User | null = await userService.getUserById(username);
      if (!userStored) {
        return done(null, false, AuthErrors.UserNotFound() as any);
      }
      if (!userStored.isRegistered) {
        return done(null, false, AuthErrors.EmailNotValidated as any);
      }
      const passwordMatch = await bcrypt.compare(password, userStored.password);
      if (!passwordMatch) {
        return done(null, false, AuthErrors.IncorrectPassword as any);
      }
      return done(null, {
        userId: userStored.id,
        name: userStored.name,
        role: userStored.role,
        permissions: userStored.permissions,
      } satisfies AuthenticatedUser);
    } catch (error) {
      let codeStatus = 400;
      if (
        error instanceof Error &&
        error.message === `there is no document with id: ${username}`
      ) {
        return done(null, false, AuthErrors.UserNotFound() as any);
      }

      const message = error instanceof Error ? error.message : "Unknown error";
      return done(null, false, createAuthError(message, codeStatus) as any);
    }
  })
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user: User = await userService.getUserById(id);
    if (!user) {
      return done(AuthErrors.UserNotFound() as any);
    }
    const safeUser = {
      ...user,
      username: user.name,
    };
    delete (safeUser as any).password;
    done(null, safeUser);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    done(new Error(message));
  }
});

export default passport;
