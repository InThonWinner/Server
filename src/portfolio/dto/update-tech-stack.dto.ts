import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateTechStackDto {
  @IsOptional()
  @IsString()
  techStack?: string | null;

  @IsOptional()
  @IsBoolean()
  showTechStack?: boolean;
}

