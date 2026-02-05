import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as express from 'express';
import { join } from 'path';
import * as swaggerUi from 'swagger-ui-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1) Serví la carpeta openapi/ completa (openapi.yaml, paths/, schemas/, components/)
  app.use('/openapi', express.static(join(process.cwd(), 'openapi')));

  // 2) Swagger UI apuntando al YAML root por URL (así resuelve ./paths/*)
  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      swaggerOptions: {
        url: '/openapi/openapi.yaml',
      },
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
