const UserService = require("../service/UserService");
const service = new UserService(process.env.DATA_BASE_USERS);

exports.getUsers = async (req, res, next) => {
  console.log("UserController");
  const allUsers = await service.getAllUsers();
  res.status(200).send(allUsers);
};

exports.postUsers = async (req, res, next) => {
  try {
    const user = {
      id: req.body.email,
      email: req.body.email,
      name: req.body.name,
      surname: req.body.surname,
      rol: req.body.rol,
      phoneNumber: req.body.phoneNumber,
      address: req.body.address,
      startDate: req.body.startDate,
    };

    const hasEmptyValue = Object.values(user).some((value) => !value);

    if (hasEmptyValue) {
      res.status(422).send({ message: "missing properties for this user" });
    } else {
      const response = await service.addUser(user);
      if (response.error || !response) {
        res.status(409).send({ message: response.error });
      } else {
        res.status(201).json({
          message: "User created successfully",
          ...response,
        });
      }
    }
  } catch (err) {
    console.log(err);
  }
};

exports.getUser = (req, res, next) => {};

exports.putUser = (req, res, next) => {};

exports.deleteUser = (req, res, next) => {};
