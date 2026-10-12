import { Injectable } from '@nestjs/common';
import { ItemNotFoundError } from '../domain/item.errors.js';
import { ItemRepository } from '../domain/item.repository.js';

@Injectable()
export class DeleteItem {
  constructor(private readonly items: ItemRepository) {}

  async execute(id: number): Promise<void> {
    if (!(await this.items.delete(id))) {
      throw new ItemNotFoundError(id);
    }
  }
}
