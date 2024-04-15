const express = require("express");

const clockController = require("../controllers/clockController");

const ClockRouter = express.Router();

//Consultar estado de usuario

ClockRouter.get("/:id", clockController.getUserClockStatus);

//Hacer clock in a un usuario

ClockRouter.post("/in", clockController.clockStatusChange);

//Hacer clock out a un usuario

ClockRouter.post("/out", clockController.clockStatusChange);

//Marcar break start a un usuario

ClockRouter.post("/breakStart", clockController.clockStatusChange);

//Marcar break end a un usuario

ClockRouter.post("/breakEnd", clockController.clockStatusChange);

module.exports = ClockRouter;
