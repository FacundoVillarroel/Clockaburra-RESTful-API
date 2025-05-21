const daoFactory = require("../daoFactory/daoFactory").default;

const DaoFactoryInstance = daoFactory.getInstance();

class ClockService {
  constructor(type) {
    this.clock = DaoFactoryInstance.create(type, "clock");
  }

  async getStatusByUserId(userId) {
    try {
      const statusArray = await this.clock.getByUserId(userId);
      if (!statusArray[0]) {
        throw new Error(`User clock status not found with id: ${userId}`);
      } else {
        return statusArray[0];
      }
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createClockForNewUser(userId) {
    try {
      const clock = {
        clockedIn: false,
        currentTimesheetId: null,
        onBreak: false,
        userId,
      };
      return await this.clock.addNewClock(clock);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async postClockIn(userClockStatus) {
    try {
      const userStatusUpdate = userClockStatus;
      userStatusUpdate.clockedIn = true;
      await this.clock.updateStatus(userStatusUpdate.id, userStatusUpdate);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async postClockOut(userClockStatus) {
    try {
      const userStatusUpdate = userClockStatus;
      userStatusUpdate.clockedIn = false;
      userStatusUpdate.onBreak = false;
      await this.clock.updateStatus(userStatusUpdate.id, userStatusUpdate);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async postBreakStart(userClockStatus) {
    try {
      const userStatusUpdate = userClockStatus;
      userStatusUpdate.onBreak = true;
      await this.clock.updateStatus(userStatusUpdate.id, userStatusUpdate);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async postBreakEnd(userClockStatus) {
    try {
      const userStatusUpdate = userClockStatus;
      userStatusUpdate.onBreak = false;
      await this.clock.updateStatus(userStatusUpdate.id, userStatusUpdate);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async deleteClockByUserId(id) {
    try {
      return await this.clock.deleteById(id);
    } catch (error) {
      throw new Error(error.message);
    }
  }
}

module.exports = ClockService;
