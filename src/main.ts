import './config/global/enviorment.config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import { getGlobalFilters } from './common/exceptions';
import cookieParser = require('cookie-parser');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: [process.env.URL_CLIENT], credentials: true });
  const httpAdapter = app.get(HttpAdapterHost);
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.use(cookieParser());
  app.useGlobalFilters(...getGlobalFilters(httpAdapter));

  app.setGlobalPrefix('/api');
  await app.listen(process.env.PORT);
}
bootstrap();
