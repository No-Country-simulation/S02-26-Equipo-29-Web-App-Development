import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupExternalSwagger } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupExternalSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
