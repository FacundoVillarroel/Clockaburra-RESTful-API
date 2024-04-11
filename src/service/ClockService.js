const daoFactory = require("../daoFactory/daoFactory");

const DaoFactoryInstance = daoFactory.getInstance();

class ClockService {
  constructor(type) {
    this.clock = DaoFactoryInstance.create(type, "clock");
  }
}

module.exports = ClockService;
