import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CategoryEntity } from '../categories/entities/category.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { QueryProductDto } from './dto/query-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  private toEntity(product: any) {
    return new ProductEntity({
      ...product,
      price: Number(product.price),
      category: product.category
        ? new CategoryEntity(product.category)
        : undefined,
    });
  }

  private async ensureCategoryExists(categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });
    if (!category) {
      throw new NotFoundException('Category not found');
    }
    return category;
  }

  async create(createProductDto: CreateProductDto) {
    await this.ensureCategoryExists(createProductDto.categoryId);

    try {
      const product = await this.prisma.product.create({
        data: createProductDto,
        include: {
          category: true,
        },
      });
      return this.toEntity(product);
    } catch (error) {
      throw error;
    }
  }

  async findAll(query: QueryProductDto) {
    const {
      page = 1,
      limit = 10,
      categoryId,
      isActive,
      minPrice,
      maxPrice,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    if (minPrice !== undefined && maxPrice !== undefined && minPrice > maxPrice) {
      throw new BadRequestException('minPrice cannot be greater than maxPrice');
    }

    const skip = (page - 1) * limit;
    const where: Record<string, any> = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (typeof isActive === 'boolean') {
      where.isActive = isActive;
    }
    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          description: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ];
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) {
        where.price.gte = minPrice;
      }
      if (maxPrice !== undefined) {
        where.price.lte = maxPrice;
      }
    }

    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        skip,
        take: limit,
        where,
        orderBy: {
          [sortBy]: sortOrder,
        },
        include: {
          category: true,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products.map((product) => this.toEntity(product)),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.max(1, Math.ceil(total / limit)),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return this.toEntity(product);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.findOne(id);

    if (updateProductDto.categoryId) {
      await this.ensureCategoryExists(updateProductDto.categoryId);
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: updateProductDto,
      include: {
        category: true,
      },
    });
    return this.toEntity(product);
  }

  async remove(id: string) {
    await this.findOne(id);

    await this.prisma.product.delete({ where: { id } });
    return { message: 'Product deleted successfully' };
  }
}

