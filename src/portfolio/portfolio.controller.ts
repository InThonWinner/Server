import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  ParseIntPipe,
} from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { UpdateTechStackDto } from './dto/update-tech-stack.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { UpdateProjectsDto } from './dto/update-projects.dto';
import { UpdateActivitiesAwardsDto } from './dto/update-activities-awards.dto';
import { UpdateSettingsDto } from './dto/update-settings.dto';
import { ApiOperation } from '@nestjs/swagger';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post('user/:userId')
  @ApiOperation({ summary: 'Create a portfolio' })  
  create(@Param('userId', ParseIntPipe) userId: number) {
    return this.portfolioService.create(userId);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get a portfolio' })
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.portfolioService.findByUserId(userId);
  }

  @Patch('user/:userId/tech-stack')
  @ApiOperation({ summary: 'Update tech stack' })
  updateTechStack(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: UpdateTechStackDto,
  ) {
    return this.portfolioService.updateTechStack(userId, dto);
  }

  @Patch('user/:userId/career')
  @ApiOperation({ summary: 'Update career' })
  updateCareer(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: UpdateCareerDto,
  ) {
    return this.portfolioService.updateCareer(userId, dto);
  }

  @Patch('user/:userId/projects')
  @ApiOperation({ summary: 'Update projects' })
  updateProjects(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: UpdateProjectsDto,
  ) {
    return this.portfolioService.updateProjects(userId, dto);
  }

  @Patch('user/:userId/activities-awards')
  @ApiOperation({ summary: 'Update activities and awards' })
  updateActivitiesAwards(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: UpdateActivitiesAwardsDto,
  ) {
    return this.portfolioService.updateActivitiesAwards(userId, dto);
  }

  @Patch('user/:userId/settings')
  @ApiOperation({ summary: 'Update settings' })
  updateSettings(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() dto: UpdateSettingsDto,
  ) {
    return this.portfolioService.updateSettings(userId, dto);
  }
}
