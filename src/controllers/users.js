const UserService = require("../service/UserService");
const service = new UserService(process.env.DATA_BASE_USERS);

exports.getUsers = async (req, res, next) => {
  console.log("UserController");
  const allUsers = await service.getAllUsers();
  res.status(200).send(allUsers);
};

exports.postUsers = async (req, res, next) => {
  const user = req.body.user;
  const response = await service.addUser(user);

  if (!response) {
    res.status(400).send("Faltan propiedades al user");
  } else {
    res.status(201).json({
      message: "User created successfully",
      data: response,
    });
  }
};

exports.getUser = (req, res, next) => {};

exports.putUser = (req, res, next) => {};

exports.deleteUser = (req, res, next) => {};
