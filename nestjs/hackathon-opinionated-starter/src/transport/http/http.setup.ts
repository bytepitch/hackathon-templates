import { ValidationPipe, type INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { DomainErrorFilter } from './domain-error.filter.js';

// Shared by main.ts and the e2e tests, so tests run against the same setup as the real app
export function configureHttpApp(app: INestApplication) {
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useGlobalFilters(new DomainErrorFilter());

  // Lets a front end call the API from the browser. All origins are allowed
  // unless CORS_ORIGINS is set (comma-separated)
  const origins = app.get(ConfigService).get<string>('CORS_ORIGINS');
  app.enableCors(
    origins ? { origin: origins.split(',').map((o) => o.trim()) } : undefined,
  );

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle('Hackathon API').build(),
  );
  SwaggerModule.setup('api/docs', app, document, {
    jsonDocumentUrl: 'api/openapi.json',
  });
}
