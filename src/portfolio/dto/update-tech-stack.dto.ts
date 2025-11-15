import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTechStackDto {
  @ApiPropertyOptional({ description: 'Technology stack information', example: 'React, Node.js, TypeScript' })
  @IsOptional()
  @IsString()
  techStack?: string | null;

  @ApiPropertyOptional({ description: 'Whether to show tech stack', default: true, example: true })
  @IsOptional()
  @IsBoolean()
  showTechStack?: boolean;
}

