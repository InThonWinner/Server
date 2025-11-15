import { Injectable } from "@nestjs/common";
import { Portfolio, Prisma } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class PortfolioRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findPortfolioByUserId(userId: number): Promise<Portfolio | null> {
    return this.prisma.portfolio.findUnique({
      where: { userId },
    });
  }

  async createPortfolio(userId: number): Promise<Portfolio> {
    return this.prisma.portfolio.create({
      data: { userId },
    });
  }

  async updatePortfolio(
    userId: number,
    data: Prisma.PortfolioUpdateInput,
  ): Promise<Portfolio> {
    return this.prisma.portfolio.update({
      where: { userId },
      data,
    });
  }
}