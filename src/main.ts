import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseFormatorInterceptor } from './Interceptors/response-formator.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: { origin: '*' } });
  app.useGlobalInterceptors(new ResponseFormatorInterceptor());
  await app.listen(3000,'0.0.0.0');
}
bootstrap();
