import FirebaseConfig from "../config/FirebaseConfig";
import { AppError } from "../errors/AppError";
import { InternalServerError } from "../errors/HttpErrors";
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
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error; 
      } else {
        throw new InternalServerError("Failed to fetch clock by user ID");
      }
    }
  }

  async addNewClock(clock:Clock) {
    try {
      return await this.firebaseClient.save(clock);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error; 
      } else {
        throw new InternalServerError("Failed to save clock");
      }
    }
  }

  async updateStatus(id:string, update:Partial<Clock>) {
    try {
      await this.firebaseClient.updateById(id, update);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error; 
      } else {
        throw new InternalServerError("Failed to update clock");
      }
    }
  }

  async deleteById(id:string) {
    try {
      return await this.firebaseClient.deleteById(id);
    } catch (error: unknown) {
      if (error instanceof AppError) {
        throw error; 
      } else {
        throw new InternalServerError("Failed to delete clock");
      }
    }
  }
}

export default DaoFirebaseClock;
