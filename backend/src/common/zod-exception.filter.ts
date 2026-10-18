import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { FastifyReply } from 'fastify';
import { ZodError } from 'zod/v4';

// Transforme les erreurs de validation Zod (schema.parse dans les controllers)
// en 400 au lieu d'une 500 non gérée
@Catch(ZodError)
export class ZodExceptionFilter implements ExceptionFilter {
  catch(exception: ZodError, host: ArgumentsHost) {
    const reply = host.switchToHttp().getResponse<FastifyReply>();
    const errors = exception.issues.map((issue) => ({
      path: issue.path.join('.'),
      message: issue.message,
    }));

    void reply.status(HttpStatus.BAD_REQUEST).send({
      statusCode: HttpStatus.BAD_REQUEST,
      message: errors[0]?.message ?? 'Requête invalide',
      errors,
    });
  }
}
