import {
  Controller,
  Get,
  Header,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { FastifyRequest } from 'fastify';
import { register, collectDefaultMetrics } from 'prom-client';

collectDefaultMetrics();

@Controller('metrics')
export class MetricsController {
  @Get()
  @Header('Content-Type', register.contentType)
  async getMetrics(@Req() req: FastifyRequest): Promise<string> {
    // Caddy ajoute toujours X-Forwarded-For : une requête qui en porte un vient d'Internet.
    // Prometheus scrape backend:4000 directement sur le réseau overlay, sans cet en-tête.
    if (req.headers['x-forwarded-for']) {
      throw new NotFoundException();
    }
    return register.metrics();
  }
}
