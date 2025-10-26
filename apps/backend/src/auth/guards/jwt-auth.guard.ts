// src/auth/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    console.log('JwtAuthGuard: canActivate called'); // ✅ Лог
    const request = context.switchToHttp().getRequest();
    console.log(
      'JwtAuthGuard: Authorization header:',
      request.headers.authorization,
    ); // ✅ Лог
    return super.canActivate(context);
  }
}
