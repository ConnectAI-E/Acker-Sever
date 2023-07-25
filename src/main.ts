import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import { ErrorInterceptor } from './interceptor/error.interceptor';
import { ResponseInterceptor } from './interceptor/response.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(['error']);
  app.enableCors({
    credentials: true,
  });
  app.setGlobalPrefix('api', {
    exclude: ['/'],
  });
  app.useGlobalInterceptors(new ResponseInterceptor(), new ErrorInterceptor());
  await app.listen(3002);
}
bootstrap();
