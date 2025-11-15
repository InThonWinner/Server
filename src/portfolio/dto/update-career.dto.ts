import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class UpdateCareerDto {
  @IsOptional()
  @IsString()
  career?: string | null;

  @IsOptional()
  @IsBoolean()
  showCareer?: boolean;
}

