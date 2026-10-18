import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyMultipart from '@fastify/multipart';
import fastifyCors from '@fastify/cors';
import fastifyRateLimit from '@fastify/rate-limit';
import { AppModule } from './app.module';
import { ZodExceptionFilter } from './common/zod-exception.filter';
import { registerHttpMetrics } from './metrics/http-metrics';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.useGlobalFilters(new ZodExceptionFilter());
  registerHttpMetrics(app.getHttpAdapter().getInstance());

  await app.register(fastifyCookie);

  // Limitation activée route par route (@RouteConfig({ rateLimit })), voir AuthController.
  // Derrière Cloudflare + Caddy, l'IP client réelle est dans CF-Connecting-IP.
  await app.register(fastifyRateLimit, {
    global: false,
    keyGenerator: (request) => {
      const cfIp = request.headers['cf-connecting-ip'];
      return typeof cfIp === 'string' && cfIp ? cfIp : request.ip;
    },
    errorResponseBuilder: (_request, context) => ({
      statusCode: 429,
      error: 'Too Many Requests',
      message: `Trop de tentatives, réessayez dans ${Math.ceil(context.ttl / 60000)} min`,
    }),
  });

  await app.register(fastifyMultipart, {
    limits: {
      fileSize: 10 * 1024 * 1024,
    },
  });

  await app.register(fastifyCors, {
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
  });

  void app.listen(process.env.PORT ?? 3001, '0.0.0.0');
}

void bootstrap();
