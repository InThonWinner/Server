import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProjectsDto {
  @ApiPropertyOptional({ description: 'Projects information', example: 'E-commerce platform, Mobile app development' })
  @IsOptional()
  @IsString()
  projects?: string | null;

  @ApiPropertyOptional({ description: 'Whether to show projects', default: true, example: true })
  @IsOptional()
  @IsBoolean()
  showProjects?: boolean;
}

