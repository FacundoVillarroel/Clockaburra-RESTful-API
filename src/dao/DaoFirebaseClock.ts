import FirebaseConfig from "../config/FirebaseConfig";
import type Clock from "../models/clock/types/Clock";

class DaoFirebaseClock {
  private static instance: DaoFirebaseClock;
  private firebaseClient: FirebaseConfig<Clock>;

  private constructor() {
    this.firebaseClient = new FirebaseConfig("clock");
  }

  public static getInstance() {
    if (!DaoFirebaseClock.instance) {
      DaoFirebaseClock.instance = new DaoFirebaseClock();
    }
    return DaoFirebaseClock.instance;
  }

  async getByUserId(userId: string): Promise<(Clock & { id: string })[]> {
    try {
      return await this.firebaseClient.filterByConditions([
        { field: "userId", operator: "==", value: userId },
      ]);
    } catch (error:any) {
      throw new Error(error.message);
    }
  }

  async addNewClock(clock:Clock) {
    try {
      return await this.firebaseClient.save(clock);
    } catch (error:any) {
      throw new Error(error.message);
    }
  }

  async updateStatus(id:string, update:Partial<Clock>) {
    try {
      await this.firebaseClient.updateById(id, update);
    } catch (error:any) {
      throw new Error(error.message);
    }
  }

  async deleteById(id:string) {
    try {
      return await this.firebaseClient.deleteById(id);
    } catch (error:any) {
      throw Error(error.message || "Unknown error occurred");
    }
  }
}

export default DaoFirebaseClock;
