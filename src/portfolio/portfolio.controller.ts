import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { PortfolioService } from './portfolio.service';
import { UpdateTechStackDto } from './dto/update-tech-stack.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { UpdateProjectsDto } from './dto/update-projects.dto';
import { UpdateActivitiesAwardsDto } from './dto/update-activities-awards.dto';
import { ApiOperation, ApiBearerAuth, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '@prisma/client';
import { UpdateDisplayNameDto } from './dto/update-displayname.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { UpdateAffiliationDto } from './dto/update-affiliation.dto';

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a portfolio', description: 'Create your own portfolio. Requires authentication.' })
  @ApiResponse({ status: 201, description: 'Portfolio created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  create(@Req() req: Request & { user: User }) {
    return this.portfolioService.create(req.user.id);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get my portfolio', description: 'Get your own portfolio. Requires authentication.' })
  @ApiResponse({ status: 200, description: 'Portfolio retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Portfolio not found' })
  getMyPortfolio(@Req() req: Request & { user: User }) {
    return this.portfolioService.findByUserId(req.user.id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get a portfolio by user ID', description: 'Get a portfolio by user ID. Public endpoint.' })
  @ApiParam({ name: 'userId', type: Number, description: 'User ID' })
  @ApiResponse({ status: 200, description: 'Portfolio retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Portfolio not found' })
  findByUserId(@Param('userId', ParseIntPipe) userId: number) {
    return this.portfolioService.findByUserId(userId);
  }

  @Patch('tech-stack')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update tech stack', description: 'Update your own portfolio tech stack. Requires authentication.' })
  @ApiBody({ type: UpdateTechStackDto })
  @ApiResponse({ status: 200, description: 'Tech stack updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateTechStack(
    @Body() dto: UpdateTechStackDto,
    @Req() req: Request & { user: User },
  ) {
    return this.portfolioService.updateTechStack(req.user.id, dto);
  }

  @Patch('career')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update career', description: 'Update your own portfolio career. Requires authentication.' })
  @ApiBody({ type: UpdateCareerDto })
  @ApiResponse({ status: 200, description: 'Career updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateCareer(
    @Body() dto: UpdateCareerDto,
    @Req() req: Request & { user: User },
  ) {
    return this.portfolioService.updateCareer(req.user.id, dto);
  }

  @Patch('projects')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update projects', description: 'Update your own portfolio projects. Requires authentication.' })
  @ApiBody({ type: UpdateProjectsDto })
  @ApiResponse({ status: 200, description: 'Projects updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateProjects(
    @Body() dto: UpdateProjectsDto,
    @Req() req: Request & { user: User },
  ) {
    return this.portfolioService.updateProjects(req.user.id, dto);
  }

  @Patch('activities-awards')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update activities and awards', description: 'Update your own portfolio activities and awards. Requires authentication.' })
  @ApiBody({ type: UpdateActivitiesAwardsDto })
  @ApiResponse({ status: 200, description: 'Activities and awards updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateActivitiesAwards(
    @Body() dto: UpdateActivitiesAwardsDto,
    @Req() req: Request & { user: User },
  ) {
    return this.portfolioService.updateActivitiesAwards(req.user.id, dto);
  }

  @Patch('display-name')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update display name', description: 'Update display name type. Requires authentication.' })
  @ApiBody({ type: UpdateDisplayNameDto })
  @ApiResponse({ status: 200, description: 'Display name updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateDisplayName(
    @Body() dto: UpdateDisplayNameDto,
    @Req() req: Request & { user: User },
  ) {
    return this.portfolioService.updateDisplayName(req.user.id, dto);
  }

  @Patch('contact')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update contact information', description: 'Update contact information and visibility. Requires authentication.' })
  @ApiBody({ type: UpdateContactDto })
  @ApiResponse({ status: 200, description: 'Contact updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateContact(
    @Body() dto: UpdateContactDto,
    @Req() req: Request & { user: User },
  ) {
    return this.portfolioService.updateContact(req.user.id, dto);
  }

  @Patch('affiliation')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update affiliation', description: 'Update affiliation information and visibility. Requires authentication.' })
  @ApiBody({ type: UpdateAffiliationDto })
  @ApiResponse({ status: 200, description: 'Affiliation updated successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateAffiliation(
    @Body() dto: UpdateAffiliationDto,
    @Req() req: Request & { user: User },
  ) {
    return this.portfolioService.updateAffiliation(req.user.id, dto);
  }
}
