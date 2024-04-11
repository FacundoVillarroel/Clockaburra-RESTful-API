const ShiftService = require("../service/ShiftService");
const shiftService = new ShiftService(process.env.DATA_BASE);

exports.getAllShift = async (req, res, next) => {
  try {
    //traer todos los Shift de la DB
    res.send("allShift");
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.getShiftByUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    // buscar shifts en db para ese userId
    res.send(`shifts for user: ${userId}`);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.getShiftById = async (req, res, next) => {
  try {
    const id = req.params.id;
    // buscar shifts en db para ese id
    res.send(`shift: ${id}`);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.postNewShift = async (req, res, next) => {
  try {
    const shift = {
      userId: req.body.userId,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
      breaks: req.body.breaks, //{start, end}
    };
    const hasEmptyValue = Object.values(shift).some((value) => !value);
    if (hasEmptyValue) {
      res.status(422).send({ message: "missing properties for this shift" });
    } else {
      /* const response = await service.addShift(shift)
      res.status(201).json({
        message:"shift created successfully",
        ...response
      }) */
      res.send("Shift created");
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
exports.modifyShift = async (req, res, next) => {
  try {
    const id = req.params.id;
    const update = req.body.update;
    /* const currentShift = await service.getById(id);
    if (!currentShift) {
      res.status(404).send({ message: "Could not find shift with id ", id });
    } else {
      if (!Object.keys(update).length)
        res
          .status(400)
          .send({ message: "Missing properies for the shift", updated: false });
      else {
        const shiftUpdate = { ...currentShift, ...update };
        //const response = await service.updateById(id, shiftUpdate)
        res.send({
          message:"Shift updated successfully",
          update:true,
          updatedShift:response
        })
      }
    } */
    res.send({ id: id, update: update });
  } catch (error) {
    res.status(400).send({ message: error.message, update: false });
  }
};
exports.deleteShift = async (req, res, next) => {
  try {
    const id = req.params.id;
    /* await ServiceWorker.deleteShiftById(id);
    res.status(200).send({
      message: "Shift deleted successfully",
      deleted: true,
    }); */
    res.send(`id: ${id}`);
  } catch (error) {
    res.status(400).send({ message: error.message, deleted: false });
  }
};
