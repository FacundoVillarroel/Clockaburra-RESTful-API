const express = require("express");

const ShiftRouter = express.Router();

//get all shifts

ShiftRouter.get("/", (req, res, next) => {});

//create un nuevo shift

ShiftRouter.post("/", (req, res, next) => {});

//update a shift

ShiftRouter.put("/:id", (req, res, next) => {});

//delete a shift

ShiftRouter.delete("/:id", (req, res, next) => {});

module.exports = ShiftRouter;
