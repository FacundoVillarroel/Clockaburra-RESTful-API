const ClockService = require("../service/ClockService");
const clockService = new ClockService(process.env.DATA_BASE);

// Validar el id Ingresado, devolver usuario encontrado
exports.getUserClockStatus = async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (userId) {
      const userClockStatus = await clockService.getStatusByUserId(userId);
      res.send(userClockStatus);
    } else {
      throw new Error("Must enter a User Id");
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

//Unificar post en un solo export

//validar si existe usuario con userId, validar si esta clockOut, almacenar en timesheet el historial de acciones
exports.postClockIn = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      throw new Error("Must enter userId in the body");
    }
    const userClockStatus = await clockService.getStatusByUserId(userId);
    if (userClockStatus.clockedIn) {
      throw new Error("This user is already clocked in");
    }
    //verificar si tenia turno y pasar expectedHours a timesheet
    await clockService.postClockIn(userClockStatus);
    //registrar accion en timesheet
    //crear nuevo Timesheet(userId, startDate, expectedHours)
    res.send({ message: `User ${userId} clocked In`, updated: true });
  } catch (error) {
    res.status(400).send({ message: error.message, updated: false });
  }
};

//validar si existe usuario con userId, validar si esta clockIn, almacenar en timesheet el historial de acciones
exports.postClockOut = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      throw new Error("Must enter userId in the body");
    }
    const userClockStatus = await clockService.getStatusByUserId(userId);
    if (!userClockStatus.clockedIn) {
      throw new Error("This user is not clocked in");
    }
    await clockService.postClockOut(userClockStatus);
    // si esta en break, registrar tambien el fin del break
    // registrar accion en timesheet
    // utilizar metodo de Timesheet.save(new Date())
    res.send({ message: `User ${userId} clocked Out`, updated: true });
  } catch (error) {
    res.status(400).send({ message: error.message, updated: false });
  }
};

//validar si existe usuario con userId, validar si esta clockIn, almacenar en timesheet el historial de acciones
exports.postBreakStart = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      throw new Error("Must enter userId in the body");
    }
    const userClockStatus = await clockService.getStatusByUserId(userId);
    if (!userClockStatus.clockedIn) {
      throw new Error("This user is not clocked in");
    }
    await clockService.postBreakStart(userClockStatus);
    //registrar accion en timesheet
    //utilizar metodo Timesheet.updateBreak("start", date)
    res.send({ message: `User ${userId} break started`, updated: true });
  } catch (error) {
    res.status(400).send({ message: error.message, updated: false });
  }
};

//validar si existe usuario con userId, validar si esta clockIn, almacenar en timesheet el historial de acciones
exports.postBreakEnd = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      throw new Error("Must enter userId in the body");
    }
    const userClockStatus = await clockService.getStatusByUserId(userId);
    if (!userClockStatus.clockedIn) {
      throw new Error("This user is not clocked in");
    }
    if (!userClockStatus.onBreak) {
      throw new Error("This user is not on break");
    }
    await clockService.postBreakEnd(userClockStatus);
    //registrar accion en timesheet
    // utilizar metodo Timesheet.updateBreak("end", date)
    res.send({ message: `User ${userId} break ended`, updated: true });
  } catch (error) {
    res.status(400).send({ message: error.message, updated: false });
  }
};
