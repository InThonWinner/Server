import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';
import { PostCategory } from '@prisma/client';

export class UpdatePostDto extends PartialType(CreatePostDto) {
  @ApiPropertyOptional({
    description: 'Post category',
    enum: PostCategory,
  })
  category?: PostCategory;

  @ApiPropertyOptional({
    description: 'Post title',
  })
  title?: string;

  @ApiPropertyOptional({
    description: 'Post content',
  })
  content?: string;

  @ApiPropertyOptional({
    description: 'Whether the post is anonymous',
  })
  isAnonymous?: boolean;
}

