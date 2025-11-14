import { Injectable, ServiceUnavailableException } from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private readonly prisma: PrismaService) {}

  getStatus() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
    };
  }

  async checkDatabase() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        database: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      throw new ServiceUnavailableException({
        status: 'error',
        database: 'disconnected',
        error: 'Database connection failed',
      });
    }
  }
}

