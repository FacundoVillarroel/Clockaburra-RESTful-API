import FirebaseConfig from "../config/FirebaseConfig";
import type Role from "../models/roles/types/Role";

class DaoFirebaseRoles {
  private static instance: DaoFirebaseRoles;
  private firebaseClient: FirebaseConfig<Role>;

  private constructor() {
    this.firebaseClient = new FirebaseConfig("roles");
  }

  public static getInstance() {
    if (!DaoFirebaseRoles.instance) {
      DaoFirebaseRoles.instance = new DaoFirebaseRoles();
    }
    return DaoFirebaseRoles.instance;
  }

  async getAll() {
    try {
      return await this.firebaseClient.getAll();
    } catch (error:any) {
      throw new Error(error.message || "Unknown error occurred");
    }
  }

  async save(role:Role) {
    try {
      return await this.firebaseClient.save(role);
    } catch (error:any) {
      throw new Error(error.message || "Unknown error occurred");
    }
  }

  async getById(id:string): Promise<Role & { id: string } | null> {
    try {
      return await this.firebaseClient.getById(id);
    } catch (error:any) {
      throw new Error(error.message || "Unknown error occurred");
    }
  }

  async updateRoleById(id:string, roleUpdate:Partial<Role>) {
    try {
      await this.firebaseClient.updateById(id, roleUpdate);
      const updatedRole = await this.getById(id);
      return updatedRole;
    } catch (error:any) {
      throw Error(error.message || "Unknown error occurred");
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

export default DaoFirebaseRoles;
