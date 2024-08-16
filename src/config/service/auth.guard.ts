import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserRole } from 'src/modules/user/entities/user.entity';

@Injectable()
export class RoleGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}

function validateRequest(request: any): boolean | Promise<boolean> | Observable<boolean> {
  if(request.url === '/api/store/find') return true
  if(request.url === '/api/api_mannage/find') return true
  if(request.url === '/api/permiss/getPermiss') return true
  if(request.user.role !== UserRole.ADMIN) 
    throw new HttpException('权限不足', HttpStatus.UNAUTHORIZED);
  return true
}
