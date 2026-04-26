import { prisma } from "../db/prisma";

export const summaryRepository = {
  findByProductId(productId: number) {
    return prisma.summary.findUnique({
      where: {
        productId,
      },
      include: {
        product: true,
      },
    });
  },

  upsert(productId: number, content: string, expiresAt: Date) {
    return prisma.summary.upsert({
      where: {
        productId,
      },
      create: {
        productId,
        content,
        expiresAt,
      },
      update: {
        content,
        generatedAt: new Date(),
        expiresAt,
      },
      include: {
        product: true,
      },
    });
  },
};

export type SummaryWithProduct = Awaited<
  ReturnType<typeof summaryRepository.findByProductId>
>;
