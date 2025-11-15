import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateActivitiesAwardsDto {
  @ApiPropertyOptional({ description: 'Activities and awards information', example: 'Hackathon winner, Open source contributor' })
  @IsOptional()
  @IsString()
  activitiesAwards?: string | null;

  @ApiPropertyOptional({ description: 'Whether to show activities and awards', default: true, example: true })
  @IsOptional()
  @IsBoolean()
  showActivitiesAwards?: boolean;
}

