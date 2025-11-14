import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { HealthService } from './health.service';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOkResponse({ description: 'Application health status' })
  getStatus() {
    return this.healthService.getStatus();
  }

  @Get('db')
  @ApiOkResponse({ description: 'Database connectivity status' })
  async checkDatabase() {
    return this.healthService.checkDatabase();
  }
}

