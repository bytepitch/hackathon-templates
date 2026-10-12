import { Injectable } from '@nestjs/common';
import type { Item } from '../domain/item.js';
import { ItemRepository } from '../domain/item.repository.js';

@Injectable()
export class ListItems {
  constructor(private readonly items: ItemRepository) {}

  execute(): Promise<Item[]> {
    return this.items.findAll();
  }
}
