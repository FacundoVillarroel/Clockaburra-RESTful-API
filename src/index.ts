import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response, NextFunction } from "express";
import path from "path";
// @ts-ignore
import passport from "./config/PassportConfig";
// @ts-ignore
import jsonErrorHandler from "./middlewares/jsonErrorHandler";
// @ts-ignore
import UsersRouter from "./routes/usersRoutes";
// @ts-ignore
import ClockRouter from "./routes/clockRoutes";
// @ts-ignore
import ShiftRouter from "./routes/shiftRoutes";
// @ts-ignore
import TimesheetRouter from "./routes/timesheetRoutes";
// @ts-ignore
import AuthRouter from "./routes/authRoutes";
// @ts-ignore
import DepartmentsRouter from "./routes/departmentsRoutes";
// @ts-ignore
import RolesRouter from "./routes/rolesRoutes";
// @ts-ignore
import ImagesRouter from "./routes/imagesRoutes";
// @ts-ignore
import verifyJWT from "./middlewares/verifyJWT";

const app = express();
// Middleware for CORS handling
app.use((req:Request, res:Response, next:NextFunction) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://clockaburra-web.vercel.app"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return
  }
  next();
});

// Static files
const staticPath = path.join(__dirname, "..", "public");
console.log("Static path: ", staticPath);
app.use("/public", express.static(staticPath));

app.use(jsonErrorHandler.default || jsonErrorHandler);

app.use(passport.initialize());

app.get("/", (req: Request, res: Response) => {
  res.redirect("/api-docs");
});

app.get("/api-docs", (req: Request, res: Response) => {
  res.sendFile(path.join(staticPath, "api-docs.html"));
});

app.use("/users", verifyJWT.default || verifyJWT, UsersRouter.default || UsersRouter);
app.use("/clock", verifyJWT.default || verifyJWT, ClockRouter.default || ClockRouter);
app.use("/shift", verifyJWT.default || verifyJWT, ShiftRouter.default || ShiftRouter);
app.use("/timesheet", verifyJWT.default || verifyJWT, TimesheetRouter.default || TimesheetRouter);
app.use("/auth", AuthRouter.default || AuthRouter);
app.use("/department", verifyJWT.default || verifyJWT, DepartmentsRouter.default || DepartmentsRouter);
app.use("/role", verifyJWT.default || verifyJWT, RolesRouter.default || RolesRouter);
app.use("/images", verifyJWT.default || verifyJWT, ImagesRouter.default || ImagesRouter);

export default app;
