import type { InterfaceDaoBase } from "../../../daoFactory/InterfaceDaoBase";
import type User from "./User";

export type FilterParams = {
  roles: string[];
  departments: string[];
};

export interface InterfaceUserDao extends InterfaceDaoBase<User>{
  getByFilters(filters: FilterParams): Promise<(User & { id: string })[] | null>;
  updateUserById(id: string, data: Partial<User>): Promise<User & { id: string }>;
}
