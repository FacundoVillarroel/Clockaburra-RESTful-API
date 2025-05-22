import type DaoFirebaseClock from "../dao/DaoFirebaseClock";
import daoFactory from "../daoFactory/daoFactory";
import Clock from "../models/clock/types/Clock";

const DaoFactoryInstance = daoFactory.getInstance();

class ClockService {
  private clock: DaoFirebaseClock

  constructor(type:"firebase") {
    this.clock = DaoFactoryInstance.create(type, "clock");
  }

  async getStatusByUserId(userId:string) {
    try {
      const statusArray = await this.clock.getByUserId(userId);
      if (!statusArray[0]) {
        throw new Error(`User clock status not found with id: ${userId}`);
      } else {
        return statusArray[0];
      }
    } catch (error:any) {
      throw new Error(error.message);
    }
  }

  async createClockForNewUser(userId:string) {
    try {
      const clock = {
        clockedIn: false,
        currentTimesheetId: null,
        onBreak: false,
        userId,
      };
      return await this.clock.addNewClock(clock);
    } catch (error:any) {
      throw new Error(error.message);
    }
  }

  async postClockIn(userClockStatus:Partial<Clock>) {
    try {
      const userStatusUpdate = userClockStatus;
      userStatusUpdate.clockedIn = true;
      if (!userStatusUpdate.id) {
        throw new Error("User clock status not found");
      }
      await this.clock.updateStatus(userStatusUpdate.id, userStatusUpdate);
    } catch (error:any) {
      throw new Error(error.message);
    }
  }

  async postClockOut(userClockStatus:Partial<Clock>) {
    try {
      const userStatusUpdate = userClockStatus;
      userStatusUpdate.clockedIn = false;
      userStatusUpdate.onBreak = false;
      if (!userStatusUpdate.id) {
        throw new Error("User clock status not found");
      }
      await this.clock.updateStatus(userStatusUpdate.id, userStatusUpdate);
    } catch (error:any) {
      throw new Error(error.message);
    }
  }

  async postBreakStart(userClockStatus:Partial<Clock>) {
    try {
      const userStatusUpdate = userClockStatus;
      userStatusUpdate.onBreak = true;
      if (!userStatusUpdate.id) {
        throw new Error("User clock status not found");
      }
      await this.clock.updateStatus(userStatusUpdate.id, userStatusUpdate);
    } catch (error:any) {
      throw new Error(error.message);
    }
  }

  async postBreakEnd(userClockStatus:Partial<Clock>) {
    try {
      const userStatusUpdate = userClockStatus;
      userStatusUpdate.onBreak = false;
      if (!userStatusUpdate.id) {
        throw new Error("User clock status not found");
      }
      await this.clock.updateStatus(userStatusUpdate.id, userStatusUpdate);
    } catch (error:any) {
      throw new Error(error.message);
    }
  }

  async deleteClockByUserId(id:string) {
    try {
      return await this.clock.deleteById(id);
    } catch (error:any) {
      throw new Error(error.message);
    }
  }
}

export default ClockService;
