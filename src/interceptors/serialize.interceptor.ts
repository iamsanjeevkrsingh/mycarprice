import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs';
import { plainToClass } from 'class-transformer';
// import { UserDto } from 'src/users/dtos/user.dto';

interface ClassConstructor {
  new (...args: any[]): object;
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // Run something before a request is handled by the request handler

    console.log('I am running before the handler', context);

    return next.handle().pipe(
      map((data: any) => {
        // Run something before the response is sent out
        console.log('I am running after the handler', data);

        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
