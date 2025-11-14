import { ApiProperty } from '@nestjs/swagger';

import { CategoryEntity } from '../../categories/entities/category.entity';

export class ProductEntity {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'iPhone 15 Pro' })
  name: string;

  @ApiProperty({
    example: 'Latest iPhone model',
    required: false,
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({ example: 1299.99 })
  price: number;

  @ApiProperty({ example: 50 })
  stock: number;

  @ApiProperty({ example: 'uuid' })
  categoryId: string;

  @ApiProperty({ type: () => CategoryEntity, required: false })
  category?: CategoryEntity;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2024-11-14T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-11-14T12:00:00.000Z' })
  updatedAt: Date;

  constructor(partial: Partial<ProductEntity>) {
    Object.assign(this, partial);
  }
}

