import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, RequestMethod } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { LoggerService } from './modules/logger';
import { AppModule } from './app.module';
import { APP_MODULE_ID, CORS_ORIGINS } from './app.constants';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new LoggerService(),
  });
  const configService = app.get(ConfigService);
  const { port } = configService.get(APP_MODULE_ID);

  app.enableCors({
    credentials: true,
    origin: CORS_ORIGINS,
  });
  app.setGlobalPrefix('v1', {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });

  const logger = new Logger('bootstrap');

  await app.listen(port, () => {
    logger.log(`🚀 Server ready at: http://localhost:${port}/v1`);
  });
}

bootstrap();
