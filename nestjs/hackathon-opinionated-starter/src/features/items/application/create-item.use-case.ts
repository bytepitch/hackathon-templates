import { Injectable } from '@nestjs/common';
import { Item } from '../domain/item.js';
import { ItemRepository } from '../domain/item.repository.js';

export interface CreateItemInput {
  name: string;
}

@Injectable()
export class CreateItem {
  constructor(private readonly items: ItemRepository) {}

  execute(input: CreateItemInput): Promise<Item> {
    return this.items.save(Item.create(input.name));
  }
}
