import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { AppValidationPipe } from './common/pipes/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',  //모든 출처 허용
    credentials: true, //인증 정보 허용
  });
  
  const configService = app.get(ConfigService);
  
  // PrismaService는 모듈 로드 시 자동으로 초기화되므로 여기서는 가져올 필요 없음
  // 데이터베이스 연결 실패 시에도 애플리케이션이 시작되도록 함

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

  // Cloud Run은 PORT 환경 변수를 자동으로 설정합니다
  const port = process.env.PORT || configService.get<number>('port', 3000);
  const portNumber = typeof port === 'string' ? parseInt(port, 10) : port;
  
  await app.listen(portNumber, '0.0.0.0');
  console.log(`Application is running on: http://0.0.0.0:${portNumber}`);
}
bootstrap();
