import { ClassSerializerInterceptor, ShutdownSignal, ValidationPipe } from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from './app-config/config.service';
import { AppModule } from './app.module';
import { HttpErrorsFilter } from './http-errors/http-errors.filter';
import { LoggingService } from './logging/logging.service';

async function bootstrap() {
  ConfigService.init();

  const loggingService: LoggingService = new LoggingService('auth-be-Bootstrap');

  const app = await NestFactory.create(AppModule, { logger: loggingService, cors: true });
  app.enableShutdownHooks([ShutdownSignal.SIGINT]);
  app.useGlobalFilters(new HttpErrorsFilter());
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    validateCustomDecorators: true,
  }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const options = new DocumentBuilder()
    .setTitle('Users Authentication API')
    .setDescription('Provides users registration and login endpoints')
    .setVersion('1.0')
    .addTag('Users Authentication API')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('api', app, document);
  await app.listen(ConfigService.AppEnv.APP_PORT, ConfigService.AppEnv.APP_HOST);
}
bootstrap();