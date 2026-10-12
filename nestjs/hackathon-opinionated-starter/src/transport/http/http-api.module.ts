import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ItemsHttpModule } from '../../features/items/http/items-http.module.js';
import { DatabaseModule } from '../../shared/database/database.module.js';
import { HealthController } from './health.controller.js';

// Root module of the HTTP entry point. Register each feature's HTTP module here
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ItemsHttpModule,
  ],
  controllers: [HealthController],
})
export class HttpApiModule {}
