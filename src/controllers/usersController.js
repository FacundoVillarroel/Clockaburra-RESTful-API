const UserService = require("../service/UserService");
const userService = new UserService(process.env.DATA_BASE);
const ClockService = require("../service/ClockService");
const clockService = new ClockService(process.env.DATA_BASE);

const { sendRegistrationEmail } = require("../utils/emailHelperFunctions");

const { isValidDate } = require("../utils/dateHelperFunctions");

exports.getUsers = async (req, res, next) => {
  const allUsers = await userService.getAllUsers();
  res.status(200).send(allUsers);
};

exports.postUsers = async (req, res, next) => {
  try {
    if (isNaN(parseFloat(req.body.hourlyRate))) {
      throw new Error("hourlyRate must be a Number");
    }
    const user = {
      id: req.body.email,
      email: req.body.email,
      name: req.body.name,
      surname: req.body.surname,
      role: req.body.role,
      startDate: req.body.startDate,
      hourlyRate: parseFloat(req.body.hourlyRate),
      isRegistered: false,
    };
    if (!isValidDate(user.startDate)) {
      throw new Error("Date entered is invalid");
    }

    const hasEmptyValue = Object.entries(user).some(([key, value]) => {
      if (key === "isRegistered" || typeof value === "boolean") {
        return false;
      }
      return !value;
    });

    if (hasEmptyValue) {
      res.status(422).send({ message: "missing properties for this user" });
    } else {
      const response = await userService.addUser(user);
      await clockService.createClockForNewUser(user.id);

      const emailResponse = await sendRegistrationEmail(user.email, user.name);
      console.log("EMAIL", emailResponse.body);
      res.status(201).send({
        message: "User created successfully",
        ...response,
      });
    }
  } catch (error) {
    res.status(409).send({ message: error.message });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await userService.getUserById(id);
    delete user.password;
    res.send({ user });
  } catch (error) {
    console.log(error);
    res.status(404).send(error.message);
  }
};

exports.putUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const userUpdate = req.body.userUpdate;
    if (!Object.keys(userUpdate).length)
      res
        .status(400)
        .send({ message: "Missing properies for the user", updated: false });
    else {
      const response = await userService.updateUserById(id, userUpdate);
      res.send({
        message: "User updated successfully",
        updated: true,
        updatedUser: response,
      });
    }
  } catch (error) {
    res.status(400).send({ message: error.message, updated: false });
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    await userService.deleteUserById(id);
    const clock = await clockService.getStatusByUserId(id);
    await clockService.deleteClockByUserId(clock.id);
    res
      .status(200)
      .send({ message: "User deleted successfully", deleted: true });
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: error.message, deleted: false });
  }
};
