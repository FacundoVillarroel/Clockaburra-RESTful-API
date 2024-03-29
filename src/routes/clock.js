const express = require("express");

const ClockRouter = express.Router();

//Consultar estado de usuario

ClockRouter.get("/:id", (req, res, next) => {});

//Hacer clock in a un usuario

ClockRouter.post("/in", (req, res, next) => {});

//Hacer clock out a un usuario

ClockRouter.get("/out", (req, res, next) => {});

//Marcar break start a un usuario

ClockRouter.get("/breakStart", (req, res, next) => {});

//Marcar break end a un usuario

ClockRouter.get("/breakEnd", (req, res, next) => {});

module.exports = ClockRouter;
