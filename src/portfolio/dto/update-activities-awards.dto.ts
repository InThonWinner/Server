import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateActivitiesAwardsDto {
  @IsOptional()
  @IsString()
  activitiesAwards?: string | null;

  @IsOptional()
  @IsBoolean()
  showActivitiesAwards?: boolean;
}

