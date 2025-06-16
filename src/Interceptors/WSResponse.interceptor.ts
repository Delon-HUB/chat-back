import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Socket } from 'socket.io';
import { IResponse } from 'src/Interfaces/IResponse';

@Injectable()
export class WSResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const client = context.switchToWs().getClient() as Socket;
    const response: IResponse = {
      success: false,
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
