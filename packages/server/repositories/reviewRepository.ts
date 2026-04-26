import { prisma } from "../db/prisma";

export const reviewRepository = {
  findMany(productId?: number) {
    return prisma.review.findMany({
      where: productId === undefined ? undefined : { productId },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },

  findRecentByProductId(productId: number, limit: number) {
    return prisma.review.findMany({
      where: {
        productId,
      },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });
  },
};

export type ReviewWithProduct = Awaited<
  ReturnType<typeof reviewRepository.findMany>
>[number];
