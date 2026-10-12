import {
  type ArgumentsHost,
  BadRequestException,
  Catch,
  type ExceptionFilter,
  NotFoundException,
} from '@nestjs/common';
import type { Response } from 'express';
import { NotFoundError, ValidationError } from '../../shared/domain/errors.js';

// Turns errors thrown by use cases into HTTP responses, so the core never imports HTTP code
@Catch(NotFoundError, ValidationError)
export class DomainErrorFilter implements ExceptionFilter {
  catch(error: NotFoundError | ValidationError, host: ArgumentsHost) {
    const httpError =
      error instanceof NotFoundError
        ? new NotFoundException(error.message)
        : new BadRequestException(error.message);

    host
      .switchToHttp()
      .getResponse<Response>()
      .status(httpError.getStatus())
      .json(httpError.getResponse());
  }
}
