import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function generate() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Caregiving API')
    .setDescription('Caregiving PYME API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config, {
    deepScanRoutes: true,
  });

  const outputPath = join(process.cwd(), 'openapi', 'openapi.json');

  writeFileSync(outputPath, JSON.stringify(document, null, 2));

  await app.close();

  console.log('✅ OpenAPI generado en openapi/openapi.json');
}

generate();
