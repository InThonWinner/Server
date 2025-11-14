import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class QueryProductDto {
  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  page = 1;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @IsPositive()
  limit = 10;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @Transform(({ value }) => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    if (typeof value === 'boolean') {
      return value;
    }
    return value === 'true';
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @Type(() => Number)
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  minPrice?: number;

  @Type(() => Number)
  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  maxPrice?: number;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  @IsIn(['name', 'price', 'createdAt'])
  sortBy: 'name' | 'price' | 'createdAt' = 'createdAt';

  @IsOptional()
  @IsString()
  @IsIn(['asc', 'desc'])
  sortOrder: 'asc' | 'desc' = 'desc';
}

