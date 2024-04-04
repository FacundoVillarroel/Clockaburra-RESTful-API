// Validar el id Ingresado, devolver usuario encontrado
exports.getUserClockStatus = async (req, res, next) => {
  try {
    const userId = req.params.id;
    if (userId) {
      // Traer user de DB con el id ingresado
      res.send(userId); // retornar userClockStatus
    } else {
      throw new Error("Must enter a User Id");
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

//validar si existe usuario con userId, validar si esta clockOut, almacenar en timesheet el historial de acciones
exports.postClockIn = async (req, res, next) => {
  try {
    const userId = req.body.id;
    if (userId) {
      //traer User por id - validar que este clockOut, hacer clockIn, registrar accion en timesheet
      // traer userClockStatus usando el metodo del service
      res.send(userId); // Retornar userClockStatus
    } else {
      throw new Error("Must enter a User Id");
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

//validar si existe usuario con userId, validar si esta clockIn, almacenar en timesheet el historial de acciones
exports.postClockOut = async (req, res, next) => {
  try {
    const userId = req.body.id;
    if (userId) {
      //traer User por id - validar que este clockOut, hacer clockIn, registrar accion en timesheet
      // traer userClockStatus usando el metodo del service
      res.send(userId); // Retornar userClockStatus
    } else {
      throw new Error("Must enter a User Id");
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

//validar si existe usuario con userId, validar si esta clockIn, almacenar en timesheet el historial de acciones
exports.postBreakStart = async (req, res, next) => {
  try {
    const userId = req.body.id;
    if (userId) {
      //traer User por id - validar que este clockIn, cambiar estado onBreak = true, registrar accion en timesheet
      // traer userClockStatus usando el metodo del service
      res.send(userId); // Retornar userClockStatus
    } else {
      throw new Error("Must enter a User Id");
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

//validar si existe usuario con userId, validar si esta clockIn, almacenar en timesheet el historial de acciones
exports.postBreakEnd = async (req, res, next) => {
  try {
    const userId = req.body.id;
    if (userId) {
      //traer User por id - validar que este clockIn, cambiar estado onBreak = false, registrar accion en timesheet
      // traer userClockStatus usando el metodo del service
      res.send(userId); // Retornar userClockStatus
    } else {
      throw new Error("Must enter a User Id");
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
