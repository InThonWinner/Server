import {
  BadRequestException,
  ValidationError,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';

export class AppValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      exceptionFactory: (errors: ValidationError[]) => {
        const messages = errors
          .map((error) => Object.values(error.constraints ?? {}))
          .flat();
        return new BadRequestException(messages.length ? messages : undefined);
      },
      ...options,
    });
  }
}

