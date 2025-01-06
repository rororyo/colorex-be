import { DeepPartial, Repository } from 'typeorm';
import { IGenericRepository } from '../../../core';

export class PostgreGenericRepository<T extends object> implements IGenericRepository<T> {
  private _repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this._repository = repository;
  }

  async getAll(): Promise<T[]> {
    return this._repository.find();
  }

  async get(id: string): Promise<T> {
    const entity = await this._repository.findOne({ where: { id } as any });
    if (!entity) {
      throw new Error(`Entity with id ${id} not found`);
    }
    return entity;
  }

  async create(item: T): Promise<T> {
    const newEntity = this._repository.create(item);
    return this._repository.save(newEntity);
  }

  async update(id: string, item: DeepPartial<T>): Promise<void> {
    const updateResult = await this._repository.update(id, item as any);
    if (updateResult.affected === 0) {
      throw new Error(`Entity with id ${id} not found`);
    }
  }
}
