import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getStatus() {
    return {
      name: 'NestJS API',
      message: 'Service is running',
      timestamp: new Date().toISOString(),
    };
  }
}
