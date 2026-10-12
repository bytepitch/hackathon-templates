import { ApiProperty } from '@nestjs/swagger';
import type { Item } from '../../domain/item.js';

export class ItemResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Coffee' })
  name: string;

  @ApiProperty()
  createdAt: Date;

  static from(item: Item): ItemResponse {
    return { id: item.id!, name: item.name, createdAt: item.createdAt };
  }
}
