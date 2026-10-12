import { NestFactory } from '@nestjs/core';
import { HttpApiModule } from './transport/http/http-api.module.js';
import { configureHttpApp } from './transport/http/http.setup.js';

async function bootstrap() {
  const app = await NestFactory.create(HttpApiModule);
  configureHttpApp(app);
  app.enableShutdownHooks();
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
