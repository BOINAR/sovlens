import { FastifyInstance } from 'fastify';
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

// Le label `route` est le motif de la route (/sharing/:token), jamais l'URL réelle :
// pas de token de partage dans les métriques, et un nombre de séries borné
export function registerHttpMetrics(fastify: FastifyInstance) {
  fastify.addHook('onResponse', (request, reply, done) => {
    const labels = {
      method: request.method,
      route: request.routeOptions?.url ?? 'unmatched',
      status: String(reply.statusCode),
    };
    httpRequestsTotal.inc(labels);
    httpRequestDuration.observe(labels, reply.elapsedTime / 1000);
    done();
  });
}
