const ShiftService = require("../service/ShiftService");
const shiftService = new ShiftService(process.env.DATA_BASE);

exports.getAllShift = async (req, res, next) => {
  try {
    const allShifts = await shiftService.getAllShifts();
    res.send(allShifts);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.getShiftByUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const response = await shiftService.getByUserId(userId);
    res.send(response);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.getShiftById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const shift = await shiftService.getShiftById(id);
    res.send(shift);
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
    //Validate shift values
    const hasEmptyValue = Object.values(shift).some((value) => !value);
    if (hasEmptyValue) {
      res.status(422).send({ message: "missing properties for this shift" });
    } else {
      const response = await shiftService.addShift(shift);
      res.status(201).json({
        message: "shift created successfully",
        ...response,
      });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
exports.modifyShift = async (req, res, next) => {
  try {
    const id = req.params.id;
    const update = req.body.update;
    /* const currentShift = await shiftService.getById(id);
    if (!currentShift) {
      res.status(404).send({ message: "Could not find shift with id ", id });
    } else {
      if (!Object.keys(update).length)
        res
          .status(400)
          .send({ message: "Missing properies for the shift", updated: false });
      else {
        const shiftUpdate = { ...currentShift, ...update };
        //const response = await shiftService.updateById(id, shiftUpdate)
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
    await shiftService.deleteShiftById(id);
    res.status(200).send({
      message: "Shift deleted successfully",
      deleted: true,
    });
  } catch (error) {
    res.status(400).send({ message: error.message, deleted: false });
  }
};
