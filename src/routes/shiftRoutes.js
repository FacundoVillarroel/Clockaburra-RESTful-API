const express = require("express");

const shiftController = require("../controllers/shiftController");

const ShiftRouter = express.Router();

//get all shifts or get shifts by conditions on query

ShiftRouter.get("/", shiftController.getShifts);

//create un nuevo shift

ShiftRouter.post("/", shiftController.postNewShift);

// get shifts based in query parameters as filter

ShiftRouter.get("/user/:userId", shiftController.getShiftByUser);

// get a specific shift

ShiftRouter.get("/:id", shiftController.getShiftById);

//update a shift

ShiftRouter.put("/:id", shiftController.modifyShift);

//delete a shift

ShiftRouter.delete("/:id", shiftController.deleteShift);

module.exports = ShiftRouter;
