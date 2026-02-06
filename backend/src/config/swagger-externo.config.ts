import type { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync } from 'fs';
import swaggerUi from 'swagger-ui-express';
import type { Request, Response } from 'express';

function resolveOpenapiDir(): string {
  const cwd = process.cwd();

  const distOpenapi = join(cwd, 'dist', 'openapi');
  if (existsSync(join(distOpenapi, 'openapi.yaml'))) return distOpenapi;

  const rootOpenapi = join(cwd, 'openapi');
  if (existsSync(join(rootOpenapi, 'openapi.yaml'))) return rootOpenapi;

  return rootOpenapi;
}

export function setupExternalSwagger(app: NestExpressApplication) {
  const openapiDir = resolveOpenapiDir();

  // ✅ sirve /openapi sin importar express.static manualmente
  app.useStaticAssets(openapiDir, { prefix: '/openapi' });

  app.use(
    '/docs',
    swaggerUi.serve,
    swaggerUi.setup(undefined, {
      swaggerOptions: { url: '/openapi/openapi.yaml' },
    }),
  );

  // ✅ health tipado (evita unsafe any)
  app
    .getHttpAdapter()
    .get('/health', (_req: Request, res: Response) =>
      res.status(200).json({ ok: true }),
    );
}
