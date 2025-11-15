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
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostCategory, User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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

  @Get(':id')
  @ApiOperation({
    summary: 'Get a post by ID',
    description: 'Retrieve a single post by its ID.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
  })
  findPostById(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.postService.findPostById(id);
  }
  

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create a post',
    description: 'Create a new post. Requires authentication. Supports both anonymous and non-anonymous posts.',
  })
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid request data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  create(
    @Body() createPostDto: CreatePostDto,
    @Req() req: Request & { user: User },
  ) {
    return this.postService.create(req.user.id, createPostDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update a post',
    description: 'Update a post. Requires authentication. Only the author can update their own posts.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Post ID to update',
  })
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
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
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: Request & { user: User },
  ) {
    return this.postService.update(id, req.user.id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Delete a post',
    description: 'Delete a post. Requires authentication. Only the author can delete their own posts.',
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Post ID to delete',
  })
  @ApiResponse({
    status: 200,
    description: 'Post deleted successfully',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
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
    @Req() req: Request & { user: User },
  ) {
    return this.postService.remove(id, req.user.id);
  }
}

