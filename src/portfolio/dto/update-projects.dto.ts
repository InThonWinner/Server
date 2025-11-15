import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateProjectsDto {
  @IsOptional()
  @IsString()
  projects?: string | null;

  @IsOptional()
  @IsBoolean()
  showProjects?: boolean;
}

