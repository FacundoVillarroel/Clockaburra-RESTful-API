import dotenv from "dotenv";
dotenv.config();

import express, { Request, Response } from "express";
import path from "path";
import passport from "./config/PassportConfig";
import jsonErrorHandler from "./middlewares/jsonErrorHandler";
import UsersRouter from "./routes/usersRoutes";
import ClockRouter from "./routes/clockRoutes";
import ShiftRouter from "./routes/shiftRoutes";
import TimesheetRouter from "./routes/timesheetRoutes";
import AuthRouter from "./routes/authRoutes";
import DepartmentsRouter from "./routes/departmentsRoutes";
import RolesRouter from "./routes/rolesRoutes";
import ImagesRouter from "./routes/imagesRoutes";
import verifyJWT from "./middlewares/verifyJWT";
import corsHandler from "./middlewares/corsHandler";

const app = express();
// Middleware for CORS handling
app.use(corsHandler);

// Static files
const staticPath = path.join(__dirname, "..", "public");
console.log("Static path: ", staticPath);
app.use("/public", express.static(staticPath));

app.use(jsonErrorHandler);

app.use(passport.initialize());

app.get("/", (req: Request, res: Response) => {
  res.redirect("/api-docs");
});

app.get("/api-docs", (req: Request, res: Response) => {
  res.sendFile(path.join(staticPath, "api-docs.html"));
});

app.use("/users", verifyJWT, UsersRouter);
app.use("/clock", verifyJWT, ClockRouter);
app.use("/shift", verifyJWT, ShiftRouter);
app.use("/timesheet", verifyJWT, TimesheetRouter);
app.use("/auth", AuthRouter);
app.use("/department", verifyJWT, DepartmentsRouter);
app.use("/role", verifyJWT, RolesRouter);
app.use("/images", verifyJWT, ImagesRouter);

export default app;
