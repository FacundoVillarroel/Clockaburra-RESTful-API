//traer todos los timesheet de la DB
exports.getAllTimesheet = async (req, res, next) => {
  try {
    // const timesheets = await service.getAll()
    //res.send(timesheets)
    res.send("all Timesheets in db");
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

//traer todas las timesheet de un usuario
exports.getUserTimesheets = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      throw new Error("Must enter a valid user id");
    } else {
      //const timesheets = await service.getTimesheetsByUser(userId)
      res.send({ message: "all timesheet for user: ", userId });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

//traer un timesheet por su Id
exports.getTimesheetById = async (req, res, next) => {
  try {
    const timesheetId = req.params.timesheetId;
    if (!timesheetId) {
      throw new Error("Must enter a valid timesheet id");
    } else {
      // const timesheet = await service.getTimesheetById(timesheetId)
      res.send({ message: "timesheet:", timesheetId });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

// approvar un timesheet
exports.approveTimesheet = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      throw new Error("Must enter a valid id");
    } else {
      // const response = await service.approveTimesheet(id)
      res.send({ message: "timesheet approved:", id });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

// rechazar timesheet
exports.rejectTimesheet = async (req, res, next) => {
  try {
    const id = req.params.id;
    if (!id) {
      throw new Error("Must enter a valid id");
    } else {
      // const response = await service.rejectTimesheet(id)
      res.send({ message: "timesheet rejected:", id });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
