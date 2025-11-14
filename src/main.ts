import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AppValidationPipe } from './common/pipes/validation.pipe';
import { PrismaService } from './prisma/prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',  //모든 출처 허용
    credentials: true, //인증 정보 허용
  });
  
  const configService = app.get(ConfigService);
  const prismaService = app.get(PrismaService);

  app.useGlobalPipes(new AppValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new LoggingInterceptor());

  const swaggerConfig = configService.get('swagger');
  const swaggerDocumentBuilder = new DocumentBuilder()
    .setTitle(swaggerConfig?.title ?? 'NestJS API')
    .setDescription(swaggerConfig?.description ?? 'NestJS API Documentation')
    .setVersion(swaggerConfig?.version ?? '1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerDocumentBuilder);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('port', 3000);
  await app.listen(port);
}
bootstrap();
