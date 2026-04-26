import { prisma } from "../db/prisma";

export const reviewRepository = {
  findMany(productId?: number) {
    return prisma.review.findMany({
      where: productId === undefined ? undefined : { productIt: productId },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  },
};

export type ReviewWithProduct = Awaited<
  ReturnType<typeof reviewRepository.findMany>
>[number];
