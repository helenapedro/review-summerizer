import { prisma } from "../db/prisma";

export const productRepository = {
  async exists(productId: number) {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
      select: {
        id: true,
      },
    });

    return product !== null;
  },
};
