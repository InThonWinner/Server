import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCareerDto {
  @ApiPropertyOptional({ description: 'Career information', example: 'Software Engineer with 5 years of experience' })
  @IsOptional()
  @IsString()
  career?: string | null;

  @ApiPropertyOptional({ description: 'Whether to show career', default: true, example: true })
  @IsOptional()
  @IsBoolean()
  showCareer?: boolean;
}

