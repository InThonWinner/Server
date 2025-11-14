import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const electronics = await prisma.category.upsert({
    where: { name: 'Electronics' },
    update: {},
    create: {
      name: 'Electronics',
      description: 'Electronic devices and accessories',
    },
  });

  const existingProduct = await prisma.product.findFirst({
    where: { name: 'iPhone 15 Pro' },
  });

  if (!existingProduct) {
    await prisma.product.create({
      data: {
        name: 'iPhone 15 Pro',
        description: 'Latest iPhone model',
        price: 1299.99,
        stock: 50,
        categoryId: electronics.id,
      },
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

