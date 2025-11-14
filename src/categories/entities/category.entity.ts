import { ApiProperty } from '@nestjs/swagger';

export class CategoryEntity {
  @ApiProperty({ example: 'uuid' })
  id: string;

  @ApiProperty({ example: 'Electronics' })
  name: string;

  @ApiProperty({
    example: 'Electronic devices and accessories',
    required: false,
    nullable: true,
  })
  description?: string | null;

  @ApiProperty({ example: '2024-11-14T12:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-11-14T12:00:00.000Z' })
  updatedAt: Date;

  constructor(partial: Partial<CategoryEntity>) {
    Object.assign(this, partial);
  }
}

