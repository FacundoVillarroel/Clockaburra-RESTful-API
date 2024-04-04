const express = require("express");

const clockController = require("../controllers/clockController");

const ClockRouter = express.Router();

//Consultar estado de usuario

ClockRouter.get("/:id", clockController.getUserClockStatus);

//Hacer clock in a un usuario

ClockRouter.post("/in", clockController.postClockIn);

//Hacer clock out a un usuario

ClockRouter.post("/out", clockController.postClockOut);

//Marcar break start a un usuario

ClockRouter.post("/breakStart", clockController.postBreakStart);

//Marcar break end a un usuario

ClockRouter.post("/breakEnd", clockController.postBreakEnd);

module.exports = ClockRouter;
