import type { INestApplication } from '@nestjs/common';
import * as express from 'express';
import { join } from 'path';
import { existsSync } from 'fs';
import * as swaggerUi from 'swagger-ui-express';

function resolveOpenapiDir(): string {
  const cwd = process.cwd();

  // ✅ Render / producción típico: openapi copiado dentro de dist
  const distOpenapi = join(cwd, 'dist', 'openapi');
  if (existsSync(join(distOpenapi, 'openapi.yaml'))) return distOpenapi;

  // ✅ Dev local: openapi en la raíz del repo
  const rootOpenapi = join(cwd, 'openapi');
  if (existsSync(join(rootOpenapi, 'openapi.yaml'))) return rootOpenapi;

  // fallback: igual devolvemos root para que el error sea claro
  return rootOpenapi;
}

export function setupExternalSwagger(app: INestApplication) {
  const openapiDir = resolveOpenapiDir();

  // Sirve el contenido del folder openapi bajo /openapi
  app.use('/openapi', express.static(openapiDir));

  // Swagger UI apuntando al YAML servido (resuelve ./paths/* y ./schemas/*)
  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      swaggerOptions: {
        url: '/openapi/openapi.yaml',
      },
    }),
  );

  // (Opcional) endpoint health simple
  app
    .getHttpAdapter()
    .get('/health', (_req, res) => res.status(200).json({ ok: true }));
}
