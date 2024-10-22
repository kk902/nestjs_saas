import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadGatewayException, BadRequestException, Inject, LoggerService } from '@nestjs/common';
import { error } from 'console';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map, tap } from 'rxjs/operators';

@Injectable()
export class HttpInterceptor implements NestInterceptor {


  constructor (private readonly logger:LoggerService){

  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const {url,method}= context.switchToHttp().getRequest()
    return next
      .handle()
      .pipe(
        map((data)=>{
          return data
        }),
        catchError((err) => throwError(() =>{
          const path = `[${method}] - ${url}`
          this.logger.error(err.message,{path})
          return err
        })),
        finalize(()=>{
          this.logger.log(`[${method}] - ${url} :::${Date.now() - now}ms`)
        })
        
      )
  }
}