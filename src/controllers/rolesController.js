const RolesService = require("../service/RolesService");
const rolesService = new RolesService(process.env.DATA_BASE);

exports.getRoles = async (req, res, next) => {
  try {
    /** 
     * method description: get all the roles from db, 
     * input variables: none
     * return: array with role objects
    */
    const roles = await rolesService.getRoles();
    res.send(roles);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.getRoleById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const role = await rolesService.getRoleById(id);
    res.send(role);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.postNewRole = async (req, res, next) => {
  try {
    const role = {
      name: req.body.name,
      description: req.body.description,
    };
    if (!role.name) {
      res.status(422).send({ message: "Role Name can not be empty" });
    } else {
      const response = await rolesService.addRole(role);
      res.status(201).send({
        message: "role created successfully",
        ...response,
      });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.modifyRoleById = async (req, res, next) => {
  try {
    const id = req.params.id;
    const roleUpdate = req.body;
    if (!Object.keys(roleUpdate).length) {
      res.status(400).send({
        message: "role update can not be empty",
        updated: false,
      });
    } else {
      await rolesService.updateRoleById(id, roleUpdate);
      res.send({
        message: "Role updated successfully",
        updated: true,
        updatedRole: { id: id, ...roleUpdate },
      });
    }
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};

exports.deleteRoleById = async (req, res, next) => {
  try {
    const id = req.params.id;
    await rolesService.deleteRoleById(id);
    res.status(200).send({
      message: "Role deleted successfully",
      deleted: true,
    });
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
};
