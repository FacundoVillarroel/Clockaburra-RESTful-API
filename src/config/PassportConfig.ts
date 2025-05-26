import { Request } from "express";

import passport from "passport";
import { Strategy as LocalStrategy, IStrategyOptionsWithRequest } from "passport-local";
import bcrypt from "bcrypt";
// @ts-ignore
import UserService from "../service/UserService";
import type User from "../models/users/types/User";
import { AuthenticatedUser } from "../models/users/types/AuthenticatedUser";
import { AppError } from "../errors/AppError";
import {
  NotFoundError,
  ConflictError,
  BadRequestError,
  InternalServerError,
} from "../errors/HttpErrors";

if (process.env.DATA_BASE !== "firebase") {
  throw new Error(
    "DATA_BASE environment variable is not defined or is not set to 'firebase'"
  );
}

const userService = new UserService(process.env.DATA_BASE);

export const AuthErrors = {
  UserNotFound: (customMsg?: string) => new NotFoundError(customMsg || "User"),

  AlreadyRegistered: new ConflictError("This email is already registered"),

  PasswordTooShort: new BadRequestError(
    "The password must be at least 8 characters"
  ),

  EmailNotPendingRegistration: new NotFoundError(
    "Email for pending registration"
  ),

  EmailNotValidated: new BadRequestError(
    "User did not complete email validation"
  ),

  IncorrectPassword: new BadRequestError("Incorrect password"),

  Unknown: new InternalServerError("Unknown error"),
};

function createAuthError(message: string, statusCode: number): AppError {
  return { message, statusCode, isOperational: false } as AppError;
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
            AuthErrors.EmailNotPendingRegistration as AppError
          );
        }
        if (userStored.isRegistered) {
          return done(
            done(null, false, AuthErrors.AlreadyRegistered as AppError)
          );
        }
        if (password.length < 8) {
          return done(null, false, AuthErrors.PasswordTooShort as AppError);
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
      } catch (error: unknown) {
        if (error instanceof AppError && error.statusCode === 404) {
          return done(
            null,
            false,
            AuthErrors.EmailNotPendingRegistration as AppError
          );
        }

        return done(null, false, AuthErrors.Unknown as AppError);
      }
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(strategyOptions, async (req, username, password, done) => {
    try {
      const userStored: User | null = await userService.getUserById(username);
      if (!userStored) {
        return done(
          null,
          false,
          AuthErrors.UserNotFound(`user ${username} not found`) as AppError
        );
      }
      if (!userStored.isRegistered || !userStored.password) {
        return done(null, false, AuthErrors.EmailNotValidated as AppError);
      }
      const passwordMatch = await bcrypt.compare(password, userStored.password);
      if (!passwordMatch) {
        return done(null, false, AuthErrors.IncorrectPassword as AppError);
      }
      return done(null, {
        userId: userStored.id,
        name: userStored.name,
        role: userStored.role,
        permissions: userStored.permissions,
      } satisfies AuthenticatedUser);
    } catch (error) {
      let codeStatus = 400;
      if (error instanceof AppError && error.statusCode === 404) {
        return done(null, false, AuthErrors.UserNotFound("") as AppError);
      }

      const message =
        error instanceof AppError ? error.message : "Unknown error";
      return done(null, false, createAuthError(message, codeStatus) as any);
    }
  })
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const userFound = await userService.getUserById(id);
    if (!userFound) {
      return done(AuthErrors.UserNotFound() as AppError);
    }
    const user: User = userFound;
    if (!user) {
      return done(AuthErrors.UserNotFound() as AppError);
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
