import { BadGatewayException, Inject, Injectable, LoggerService, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { User } from 'src/modules/user/entities/user.entity';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
  ) {}
  use(req: Request & {user:User}, res: Response, next: NextFunction) {
    const token:any = req.headers.token
    if(!token) throw new BadGatewayException("缺少token")
      req.user  =  this.jwtService.verify(token);
    next();
  }
}
