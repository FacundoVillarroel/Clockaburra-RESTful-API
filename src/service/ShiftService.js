const daoFactory = require("../daoFactory/daoFactory");

const DaoFactoryInstance = daoFactory.getInstance();

class ShiftService {
  constructor(type) {
    this.shifts = DaoFactoryInstance.create(type, "shifts");
  }
}

module.exports = ShiftService;
