import { IsString, IsEnum, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PostCategory } from '@prisma/client';

export class CreatePostDto {
  @ApiProperty({
    description: 'Post category',
    enum: PostCategory,
    example: PostCategory.STUDY_PATH,
  })
  @IsEnum(PostCategory)
  category: PostCategory;

  @ApiPropertyOptional({
    description: 'Post title (optional)',
    example: 'Computer Science Study Tips',
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: 'Post content',
    example: 'I studied like this...',
  })
  @IsString()
  content: string;

  @ApiPropertyOptional({
    description: 'Whether the post is anonymous (default: true)',
    default: true,
    example: true,
  })
  @IsOptional()
  @IsBoolean()
  isAnonymous: boolean = true;
}

