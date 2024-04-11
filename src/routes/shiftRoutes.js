const express = require("express");

const shiftController = require("../controllers/shiftController");

const ShiftRouter = express.Router();

//get all shifts

ShiftRouter.get("/", shiftController.getAllShift);

// get all shifts for an user

ShiftRouter.get("/user/:userId", shiftController.getShiftByUser);

// get a specific shift

ShiftRouter.get("/:id", shiftController.getShiftById);

//create un nuevo shift

ShiftRouter.post("/", shiftController.postNewShift);

//update a shift

ShiftRouter.put("/:id", shiftController.modifyShift);

//delete a shift

ShiftRouter.delete("/:id", shiftController.deleteShift);

module.exports = ShiftRouter;
