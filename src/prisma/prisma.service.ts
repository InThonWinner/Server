import { INestApplication, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Database connected successfully');
    } catch (error) {
      console.error('Database connection failed:', error);
      // 연결 실패해도 애플리케이션은 계속 실행
      // 필요시 재시도 로직 추가 가능
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

