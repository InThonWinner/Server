import { Injectable } from '@nestjs/common';
import { Post, Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PostRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.PostCreateInput): Promise<Post> {
    return this.prisma.post.create({
      data,
    });
  }

  async findById(id: number): Promise<Post | null> {
    return this.prisma.post.findUnique({
      where: { id },
    });
  }

  async findMany(
    where?: Prisma.PostWhereInput,
    orderBy?: Prisma.PostOrderByWithRelationInput,
    skip?: number,
    take?: number,
  ) {
    return this.prisma.post.findMany({
      where,
      orderBy,
      skip,
      take,
      select: {
        id: true,
        title: true,
        category: true,
        createdAt: true,
        isAnonymous: true,
        authorId: true,
      },
    });
  }

  async count(where?: Prisma.PostWhereInput): Promise<number> {
    return this.prisma.post.count({ where });
  }

  async update(
    id: number,
    data: Prisma.PostUpdateInput,
  ): Promise<Post> {
    return this.prisma.post.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<Post> {
    return this.prisma.post.delete({
      where: { id },
    });
  }
}

