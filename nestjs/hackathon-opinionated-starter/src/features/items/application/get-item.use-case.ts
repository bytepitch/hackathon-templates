import { Injectable } from '@nestjs/common';
import type { Item } from '../domain/item.js';
import { ItemNotFoundError } from '../domain/item.errors.js';
import { ItemRepository } from '../domain/item.repository.js';

@Injectable()
export class GetItem {
  constructor(private readonly items: ItemRepository) {}

  async execute(id: number): Promise<Item> {
    const item = await this.items.findById(id);
    if (!item) {
      throw new ItemNotFoundError(id);
    }
    return item;
  }
}
