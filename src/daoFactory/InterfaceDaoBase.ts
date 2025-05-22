export interface InterfaceDaoBase<T> {
  getAll(): Promise<(T & { id: string })[] | null>;
  getById(id: string): Promise<T & { id: string } | null>;
  save(data: T): Promise<{ data: T; id: string }>;
  updateById?(id: string, data: Partial<T>): Promise<void>;
  deleteById(id: string): Promise<void>;
}