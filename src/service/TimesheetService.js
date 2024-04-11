const daoFactory = require("../daoFactory/daoFactory");

const DaoFactoryInstance = daoFactory.getInstance();

class TimesheetService {
  constructor(type) {
    this.thimesheets = DaoFactoryInstance.create(type, "timesheets");
  }
}

module.exports = TimesheetService;
