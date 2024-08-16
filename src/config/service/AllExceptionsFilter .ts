import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Response } from 'express';
import { Request } from 'express';

@Catch() // 捕获所有异常
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : 500; // 默认为 500

    // 格式化错误信息
    let message = exception["message"] || 'Internal server error'
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      message = typeof exceptionResponse === 'string'
        ? exceptionResponse
        : (exceptionResponse as any).message || message;
    }

    response
      .status(status) // 设置响应状态码
      .json({ // 发送 JSON 响应
        code: status,
        // timestamp: new Date().toISOString(),
        // path: request.url,
        message,
      });
  }
}
