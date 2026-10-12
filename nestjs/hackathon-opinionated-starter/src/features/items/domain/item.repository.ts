import type { Item } from './item.js';

export abstract class ItemRepository {
  abstract findAll(): Promise<Item[]>;
  abstract findById(id: number): Promise<Item | null>;
  abstract save(item: Item): Promise<Item>;
  // Returns false if there was no item with that id
  abstract delete(id: number): Promise<boolean>;
}
