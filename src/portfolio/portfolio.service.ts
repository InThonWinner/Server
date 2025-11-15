import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PortfolioRepository } from './portfolio.repository';
import { UpdateTechStackDto } from './dto/update-tech-stack.dto';
import { UpdateCareerDto } from './dto/update-career.dto';
import { UpdateProjectsDto } from './dto/update-projects.dto';
import { UpdateActivitiesAwardsDto } from './dto/update-activities-awards.dto';
import { UpdateDisplayNameDto } from './dto/update-displayname.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { UpdateAffiliationDto } from './dto/update-affiliation.dto';

@Injectable()
export class PortfolioService {
  constructor(private readonly portfolioRepository: PortfolioRepository) {}

  async findByUserId(userId: number) {
    const portfolio = await this.portfolioRepository.findPortfolioByUserId(
      userId,
    );
    if (!portfolio) {
      throw new NotFoundException(
        `Portfolio not found for user with ID ${userId}`,
      );
    }
    return portfolio;
  }

  async create(userId: number) {
    const existing = await this.portfolioRepository.findPortfolioByUserId(
      userId,
    );
    if (existing) {
      return existing;
    }
    return this.portfolioRepository.createPortfolio(userId);
  }


  // Update Logic
  async updateDisplayName(userId: number, dto: UpdateDisplayNameDto) {
    await this.create(userId);
    
    return this.portfolioRepository.updatePortfolio(userId, {
      displayNameType: dto.displayNameType,
    });
  }
  
  async updateContact(userId: number, dto: UpdateContactDto) {
    await this.create(userId);
    
    // Convert contact array to Prisma JSON format
    let contact: Prisma.InputJsonValue | typeof Prisma.JsonNull | undefined;
    if (dto.contact === null) {
      contact = Prisma.JsonNull;
    } else if (dto.contact !== undefined) {
      contact = dto.contact as unknown as Prisma.InputJsonValue;
    }
    
    return this.portfolioRepository.updatePortfolio(userId, {
      contact,
      showContact: dto.showContact,
    });
  }

  async updateAffiliation(userId: number, dto: UpdateAffiliationDto) {
    await this.create(userId);
    
    return this.portfolioRepository.updatePortfolio(userId, {
      affiliation: dto.affiliation,
      showAffiliation: dto.showAffiliation,
    });
  }

  async updateTechStack(userId: number, dto: UpdateTechStackDto) {
    await this.create(userId);
    return this.portfolioRepository.updatePortfolio(userId, {
      techStack: dto.techStack,
      showTechStack: dto.showTechStack,
    });
  }

  async updateCareer(userId: number, dto: UpdateCareerDto) {
    await this.create(userId);
    return this.portfolioRepository.updatePortfolio(userId, {
      career: dto.career,
      showCareer: dto.showCareer,
    });
  }

  async updateProjects(userId: number, dto: UpdateProjectsDto) {
    await this.create(userId);
    return this.portfolioRepository.updatePortfolio(userId, {
      projects: dto.projects,
      showProjects: dto.showProjects,
    });
  }

  async updateActivitiesAwards(
    userId: number,
    dto: UpdateActivitiesAwardsDto,
  ) {
    await this.create(userId);
    return this.portfolioRepository.updatePortfolio(userId, {
      activitiesAwards: dto.activitiesAwards,
      showActivitiesAwards: dto.showActivitiesAwards,
    });
  }
}
