import { Request, Response, NextFunction } from "express";

const corsHandler = (req:Request, res:Response, next:NextFunction) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://clockaburra-web.vercel.app"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Expose-Headers", "Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return
  }
  next();
}

export default corsHandler;