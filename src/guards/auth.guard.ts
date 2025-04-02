import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // const request = context
    //   .switchToHttp()
    //   .getRequest<Request & { session: { userId?: number } }>();
    // return !!request.session.userId;

    const request = context.switchToHttp().getRequest();
    console.log('request', request);

    return request.session.userId;
  }
}
