import { Module } from '@nestjs/common';
import { CreateItem } from './application/create-item.use-case.js';
import { DeleteItem } from './application/delete-item.use-case.js';
import { GetItem } from './application/get-item.use-case.js';
import { ListItems } from './application/list-items.use-case.js';
import { ItemRepository } from './domain/item.repository.js';
import { PostgresItemRepository } from './infrastructure/postgres-item.repository.js';

const useCases = [CreateItem, ListItems, GetItem, DeleteItem];

// Only the use cases are exported. The repository stays private to this module
@Module({
  providers: [
    ...useCases,
    { provide: ItemRepository, useClass: PostgresItemRepository },
  ],
  exports: useCases,
})
export class ItemsModule {}
