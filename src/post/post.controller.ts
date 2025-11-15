import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  ParseEnumPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostCategory } from '@prisma/client';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all posts',
    description: 'Get a list of all posts with optional category filtering and pagination.',
  })
  @ApiQuery({
    name: 'category',
    enum: PostCategory,
    required: false,
    description: 'Filter by post category',
  })
  @ApiQuery({
    name: 'skip',
    type: Number,
    required: false,
    description: 'Number of posts to skip (for pagination)',
    example: 0,
  })
  @ApiQuery({
    name: 'take',
    type: Number,
    required: false,
    description: 'Number of posts to take (for pagination)',
    example: 20,
  })
  @ApiResponse({
    status: 200,
    description: 'List of posts retrieved successfully',
  })
  findAll(
    @Query('category', new DefaultValuePipe(undefined), new ParseEnumPipe(PostCategory, { optional: true }))
    category?: PostCategory,
    @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip?: number,
    @Query('take', new DefaultValuePipe(20), ParseIntPipe) take?: number,
  ) {
    return this.postService.findAll(category, skip, take);
  }

  @Post()
  @ApiOperation({
    summary: 'Create a post',
    description: 'Create a new post. Supports both anonymous and non-anonymous posts.',
  })
  @ApiQuery({
    name: 'authorId',
    type: Number,
    description: 'Author ID',
    required: true,
  })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
  })
  create(
    @Body() createPostDto: CreatePostDto,
    @Query('authorId', ParseIntPipe) authorId: number,
  ) {
    return this.postService.create(authorId, createPostDto);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a post',
    description: 'Update a post. Only the author can update their own posts.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Post ID to update',
  })
  @ApiQuery({
    name: 'authorId',
    type: Number,
    description: 'Author ID (for permission check)',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'You can only update your own posts',
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Query('authorId', ParseIntPipe) authorId: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postService.update(id, authorId, updatePostDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a post',
    description: 'Delete a post. Only the author can delete their own posts.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Post ID to delete',
  })
  @ApiQuery({
    name: 'authorId',
    type: Number,
    description: 'Author ID (for permission check)',
    required: true,
  })
  @ApiResponse({
    status: 200,
    description: 'Post deleted successfully',
  })
  @ApiResponse({
    status: 403,
    description: 'You can only delete your own posts',
  })
  @ApiResponse({
    status: 404,
    description: 'Post not found',
  })
  remove(
    @Param('id', ParseIntPipe) id: number,
    @Query('authorId', ParseIntPipe) authorId: number,
  ) {
    return this.postService.remove(id, authorId);
  }
}

