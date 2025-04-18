const ShiftService = require("../service/ShiftService");
const shiftService = new ShiftService(process.env.DATA_BASE);

exports.getShifts = async (req, res, next) => {
  try {
    const userIds = req.query.userIds?.split(",") || [];
    const startDate = req.query.startDate || "";
    const endDate = req.query.endDate || "";
    filters = { userIds, startDate, endDate };
    const shifts = await shiftService.getShifts(filters);
    res.send(shifts);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.getShiftByUser = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;
    const response = await shiftService.getByUserId(userId, startDate, endDate);
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
      breaks: req.body.breaks, //[{breakStart:"2024-08-26T13:00:00.000+08:00",breakEnd:"2024-08-26T13:30:00.000+08:00"}] || []
    };
    //Validate shift values
    const hasEmptyValue = Object.values(shift).some((value) => !value);
    if (hasEmptyValue) {
      res.status(422).send({ message: "missing properties for this shift" });
    } else {
      const response = await shiftService.addShift(shift);
      res.status(201).send({
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
    const shiftUpdate = req.body;
    if (!Object.keys(shiftUpdate).length)
      res
        .status(400)
        .send({ message: "Missing properies for the shift", updated: false });
    else {
      await shiftService.updateShiftById(id, shiftUpdate);
      res.send({
        message: "Shift updated successfully",
        update: true,
        updatedShift: { id: id, ...shiftUpdate },
      });
    }
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
