import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userName?: string;
  role?: string;
  permissions?: string[];
}

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables");
}
const JWT_SECRET = process.env.JWT_SECRET;

const verifyJWT = (req: AuthenticatedRequest, res:Response, next:NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return 
  }

  jwt.verify(token, JWT_SECRET, (err, decoded: string | jwt.JwtPayload | undefined) => {
    if (err) {
      res.status(403).json({ message: "Failed to authenticate token" });
      return 
    }
    if (!decoded || typeof decoded !== "object") {
      res.status(403).json({ message: "Failed to authenticate token" });
      return 
    }
    const newToken = jwt.sign(
      {
        userId: decoded.userId,
        userName: decoded.userName,
        role: decoded.role,
        permissions: decoded.permissions,
      },
      JWT_SECRET,
      { expiresIn: "1w" }
    );

    res.setHeader("Authorization", "Bearer " + newToken);
    res.setHeader("Access-Control-Expose-Headers", "Authorization");

    req.userId = decoded.userId;
    req.userName = decoded.userName;
    req.role = decoded.role;
    req.permissions = decoded.permissions;
    next();
  });
};

export default verifyJWT;

