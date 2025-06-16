import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { IResponse } from 'src/Interfaces/IResponse';

@Injectable()
export class ResponseFormatorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response: IResponse = {
      success: true,
      data: undefined,
    };
    return next.handle().pipe(
      map((data) => {
        response.data = data;
        return response;
      }),
    );
  }
}
