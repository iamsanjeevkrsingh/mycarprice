import { CanActivate, ExecutionContext } from '@nestjs/common';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    // const request = context
    //   .switchToHttp()
    //   .getRequest<Request & { session: { userId?: number } }>();
    // return !!request.session.userId;

    const request = context.switchToHttp().getRequest();
    console.log('admin guard request', request);

    if (!request.currentUser) {
      return false;
    }
    return request.currentUser.admin;

    // return request.headers['x-access-token'] === '123';
  }
}
