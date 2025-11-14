import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryEntity } from './entities/category.entity';


@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const existing = await this.prisma.category.findFirst({
      where: { name: createCategoryDto.name },
    });

    if (existing) {
      throw new ConflictException(
        'Category with this name already exists',
      );
    }

    const category = await this.prisma.category.create({
      data: createCategoryDto,
    });
    return new CategoryEntity(category);
  }

  async findAll(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const [categories, total] = await this.prisma.$transaction([
      this.prisma.category.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.category.count(),
    ]);

    const data = categories.map((category) => new CategoryEntity(category));

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return new CategoryEntity(category);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    if (updateCategoryDto.name) {
      const existing = await this.prisma.category.findFirst({
        where: {
          name: updateCategoryDto.name,
          id: { not: id },
        },
      });

      if (existing) {
        throw new ConflictException(
          'Category with this name already exists',
        );
      }
    }

    const updated = await this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
    return new CategoryEntity(updated);
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const productCount = await this.prisma.product.count({
      where: { categoryId: id },
    });

    if (productCount > 0) {
      throw new BadRequestException(
        'Cannot delete category with existing products',
      );
    }

    await this.prisma.category.delete({ where: { id } });
    return { message: 'Category deleted successfully' };
  }
}

