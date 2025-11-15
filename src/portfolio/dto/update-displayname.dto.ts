import { ApiPropertyOptional } from '@nestjs/swagger';
import { DisplayNameType } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateDisplayNameDto {
  @ApiPropertyOptional({ description: 'Display name type', enum: DisplayNameType, example: DisplayNameType.NICKNAME })
  @IsEnum(DisplayNameType)
  displayNameType: DisplayNameType;
}
