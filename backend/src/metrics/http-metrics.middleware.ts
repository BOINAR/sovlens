import { Injectable, NestMiddleware } from '@nestjs/common';
import { Counter, Histogram } from 'prom-client';

export const httpRequestsTotal = new Counter({
  name: 'nodejs_http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

export const httpRequestDuration = new Histogram({
  name: 'nodejs_http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status'],
});

@Injectable()
export class HttpMetricsMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    const start = Date.now();
    res.on('finish', () => {
      const route = req.url;
      const labels = {
        method: req.method,
        route,
        status: String(res.statusCode),
      };
      httpRequestsTotal.inc(labels);
      httpRequestDuration.observe(labels, (Date.now() - start) / 1000);
    });
    next();
  }
}