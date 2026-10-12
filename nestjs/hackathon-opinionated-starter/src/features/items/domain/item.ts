import { ValidationError } from '../../../shared/domain/errors.js';

const MAX_NAME_LENGTH = 100;

export class Item {
  private constructor(
    readonly id: number | null,
    readonly name: string,
    readonly createdAt: Date,
  ) {}

  // A new item that hasn't been saved yet, so it has no id
  static create(name: string): Item {
    return new Item(null, Item.validName(name), new Date());
  }

  // An item loaded from storage
  static restore(id: number, name: string, createdAt: Date): Item {
    return new Item(id, name, createdAt);
  }

  private static validName(name: string): string {
    const trimmed = name.trim();
    if (!trimmed) {
      throw new ValidationError('Item name cannot be empty');
    }
    if (trimmed.length > MAX_NAME_LENGTH) {
      throw new ValidationError(
        `Item name cannot be longer than ${MAX_NAME_LENGTH} characters`,
      );
    }
    return trimmed;
  }
}
