import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PostRepository } from './post.repository';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostCategory } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(private readonly postRepository: PostRepository) {}

  async findPostById(id: number) {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }
    return post;
  }

  async findAll(
    category?: PostCategory,
    skip?: number,
    take?: number,
  ) {
    const where = category ? { category } : undefined;
    const [posts, total] = await Promise.all([
      this.postRepository.findMany(
        where,
        { createdAt: 'desc' },
        skip,
        take,
      ),
      this.postRepository.count(where),
    ]);

    return {
      data: posts,
      total,
      skip: skip ?? 0,
      take: take ?? posts.length,
    };
  }

  async create(authorId: number, createPostDto: CreatePostDto) {
    return this.postRepository.create({
      author: {
        connect: { id: authorId },
      },
      category: createPostDto.category,
      title: createPostDto.title,
      content: createPostDto.content,
      isAnonymous: createPostDto.isAnonymous,
    });
  }

  async update(id: number, authorId: number, updatePostDto: UpdatePostDto) {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`); //404 
    }

    if (post.authorId !== authorId) {
      throw new ForbiddenException('You can only update your own posts'); //403
    }

    return this.postRepository.update(id, {
      category: updatePostDto.category,
      title: updatePostDto.title,
      content: updatePostDto.content,
      isAnonymous: updatePostDto.isAnonymous,
    });
  }

  async remove(id: number, authorId: number) {
    const post = await this.postRepository.findById(id);
    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    if (post.authorId !== authorId) {
      throw new ForbiddenException('You can only delete your own posts');
    }

    return this.postRepository.delete(id);
  }
}

