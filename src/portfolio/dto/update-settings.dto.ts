import { IsEnum, IsOptional, IsBoolean, IsString, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { DisplayNameType, Prisma } from '@prisma/client';

export class ContactItemDto {
  @ApiPropertyOptional({ description: 'Type of contact (e.g., linkedin, github, email, phone, website)', example: 'linkedin' })
  @IsString()
  type: string;

  @ApiPropertyOptional({ description: 'Value of the contact (e.g., URL, email address, phone number)', example: 'https://linkedin.com/in/username' })
  @IsString()
  value: string;
}

export class UpdateSettingsDto {
  @ApiPropertyOptional({ description: 'Display name type', enum: DisplayNameType, example: DisplayNameType.NICKNAME })
  @IsOptional()
  @IsEnum(DisplayNameType)
  displayNameType?: DisplayNameType;

  @ApiPropertyOptional({
    description: 'Contact information (array of contact items)',
    type: [ContactItemDto],
    example: [
      { type: 'linkedin', value: 'https://linkedin.com/in/username' },
      { type: 'github', value: 'https://github.com/username' },
    ],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContactItemDto)
  contact?: ContactItemDto[] | null;

  @ApiPropertyOptional({ description: 'Affiliation information', example: 'Korea University, Computer Science' })
  @IsOptional()
  @IsString()
  affiliation?: string | null;

  @ApiPropertyOptional({ description: 'Whether to show contact', default: false, example: false })
  @IsOptional()
  @IsBoolean()
  showContact?: boolean;

  @ApiPropertyOptional({ description: 'Whether to show affiliation', default: false, example: false })
  @IsOptional()
  @IsBoolean()
  showAffiliation?: boolean;
}

