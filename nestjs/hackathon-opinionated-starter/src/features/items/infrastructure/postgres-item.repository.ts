import { Inject, Injectable } from '@nestjs/common';
import type { Kysely, Selectable } from 'kysely';
import { KYSELY } from '../../../shared/database/database.module.js';
import type {
  Database,
  ItemsTable,
} from '../../../shared/database/database.types.js';
import { Item } from '../domain/item.js';
import { ItemRepository } from '../domain/item.repository.js';

@Injectable()
export class PostgresItemRepository implements ItemRepository {
  constructor(@Inject(KYSELY) private readonly db: Kysely<Database>) {}

  async findAll(): Promise<Item[]> {
    const rows = await this.db
      .selectFrom('items')
      .selectAll()
      .orderBy('id')
      .execute();
    return rows.map(toItem);
  }

  async findById(id: number): Promise<Item | null> {
    const row = await this.db
      .selectFrom('items')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst();
    return row ? toItem(row) : null;
  }

  async save(item: Item): Promise<Item> {
    const row =
      item.id === null
        ? await this.db
            .insertInto('items')
            .values({ name: item.name, createdAt: item.createdAt })
            .returningAll()
            .executeTakeFirstOrThrow()
        : await this.db
            .updateTable('items')
            .set({ name: item.name })
            .where('id', '=', item.id)
            .returningAll()
            .executeTakeFirstOrThrow();
    return toItem(row);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.db
      .deleteFrom('items')
      .where('id', '=', id)
      .executeTakeFirst();
    return result.numDeletedRows > 0n;
  }
}

function toItem(row: Selectable<ItemsTable>): Item {
  return Item.restore(row.id, row.name, row.createdAt);
}
