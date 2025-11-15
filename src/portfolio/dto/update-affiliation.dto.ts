import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class UpdateAffiliationDto {
  @ApiPropertyOptional({ description: 'Affiliation information', example: 'Korea University, Computer Science' })
  @IsOptional()
  @IsString()
  affiliation?: string | null;

  @ApiPropertyOptional({ description: 'Whether to show affiliation', default: false, example: false })
  @IsOptional()
  @IsBoolean()
  showAffiliation?: boolean;
}