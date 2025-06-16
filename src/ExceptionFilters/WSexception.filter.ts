import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { IErrorResponse } from 'src/Interfaces/IResponse';

@Catch()
export class WSexceptionFilter<T> implements ExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const ctx = host.switchToWs();
    const client: Socket = ctx.getClient();

    const error: IErrorResponse = {
      success: false,
      data: {
        message: exception.message,
        timestamp: Date.now(),
      },
    };
    client.emit('error', error);
  }
}