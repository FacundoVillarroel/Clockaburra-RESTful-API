const express = require("express");

const shiftController = require("../controllers/shiftController");

const ShiftRouter = express.Router();

//get all shifts

ShiftRouter.get("/", shiftController.getAllShift);

// get all shifts for an user

ShiftRouter.get("/user/:userId", shiftController.getShiftByUser);

// get shifts from a single user for week selected

ShiftRouter.get(
  "/user/:userId/week/:startDate",
  shiftController.getShiftByUser
);

// get shifts from a single user from week selected to period of time selected

ShiftRouter.get(
  "/user/:userId/week/:startDate/:endDate",
  shiftController.getShiftByUser
);

// get a specific shift

ShiftRouter.get("/:id", shiftController.getShiftById);

//create un nuevo shift

ShiftRouter.post("/", shiftController.postNewShift);

//update a shift

ShiftRouter.put("/:id", shiftController.modifyShift);

//delete a shift

ShiftRouter.delete("/:id", shiftController.deleteShift);

module.exports = ShiftRouter;
