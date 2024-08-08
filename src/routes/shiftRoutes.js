const express = require("express");

const shiftController = require("../controllers/shiftController");

const ShiftRouter = express.Router();

//get all shifts - get shifts based in filters

ShiftRouter.get("/", shiftController.getAllShift);

//create un nuevo shift

ShiftRouter.post("/", shiftController.postNewShift);

// get shift based in query parameters as filter

ShiftRouter.get("/filterBy", shiftController.filterBy);

// get all shifts for an user - get shifts for an user based in filters

ShiftRouter.get("/user/:userId", shiftController.getShiftByUser);

// get a specific shift

ShiftRouter.get("/:id", shiftController.getShiftById);

//update a shift

ShiftRouter.put("/:id", shiftController.modifyShift);

//delete a shift

ShiftRouter.delete("/:id", shiftController.deleteShift);

module.exports = ShiftRouter;
