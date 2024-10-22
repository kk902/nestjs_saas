import { ExceptionFilter, Catch, ArgumentsHost, HttpException, BadRequestException } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus() || 500;
    const exceptionResponse = exception.getResponse();
    if(exception instanceof BadRequestException) exception.message = exceptionResponse['response']['message']
    response
      .status(status)
      .json({
        code: status,
        message: exception.message
      });
  }
}