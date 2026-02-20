import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe, VersioningType } from '@nestjs/common';

import { AppModule } from './app.module';
import { setupExternalSwagger } from './config';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const dataSource = app.get(DataSource);

  try {
    if (dataSource.isInitialized) {
      console.log('🟢 Database connected successfully');
    } else {
      await dataSource.initialize();
      console.log('🟢 Database initialized manually');
    }
  } catch (error) {
    console.error('🔴 Database connection failed');
    console.error(error);
  }

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:5174',
      'https://dulcet-truffle-679834.netlify.app',
    ],
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT', 'OPTIONS'],
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  setupExternalSwagger(app);

  const port = process.env.PORT ?? 3002;
  await app.listen(port);

  console.log(`🚀 Server running on port ${port}`);
}


void bootstrap();
