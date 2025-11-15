import { IsEnum, IsOptional, IsBoolean, IsString, IsArray } from 'class-validator';
import { DisplayNameType, Prisma } from '@prisma/client';

export class UpdateSettingsDto {
  @IsOptional()
  @IsEnum(DisplayNameType)
  displayNameType?: DisplayNameType;

  @IsOptional()
  @IsArray()
  contact?: Prisma.InputJsonValue;

  @IsOptional()
  @IsString()
  affiliation?: string | null;

  @IsOptional()
  @IsBoolean()
  showContact?: boolean;

  @IsOptional()
  @IsBoolean()
  showAffiliation?: boolean;
}

