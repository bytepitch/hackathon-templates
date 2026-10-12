import { Module } from '@nestjs/common';
import { ItemsModule } from '../items.module.js';
import { ItemsController } from './items.controller.js';

// Exposes the items use cases over HTTP. Other transports import ItemsModule directly
@Module({
  imports: [ItemsModule],
  controllers: [ItemsController],
})
export class ItemsHttpModule {}
