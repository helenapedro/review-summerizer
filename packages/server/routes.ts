import { Router } from "express";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { z } from "zod";
import { env } from "./config/env";
import { PrismaClient } from "./generated/prisma/client";

const adapter = new PrismaMariaDb(env.DATABASE_URL, {
  database: env.SUMMERIZER_DB_NAME,
});
const prisma = new PrismaClient({ adapter });

const productIdSchema = z.coerce.number().int().positive();

type ReviewWithProduct = Awaited<
  ReturnType<
    typeof prisma.review.findMany<{
      include: {
        product: true;
      };
    }>
  >
>[number];

const formatReview = (review: ReviewWithProduct) => ({
  id: review.id,
  author: review.author,
  rating: review.rating,
  content: review.content,
  createdAt: review.createdAt,
  productId: review.productIt,
  product: review.product,
});

export const routes = Router();

routes.get("/reviews", async (req, res, next) => {
  try {
    const parsedProductId =
      req.query.productId === undefined
        ? undefined
        : productIdSchema.safeParse(req.query.productId);

    if (parsedProductId && !parsedProductId.success) {
      res.status(400).json({ error: "productId must be a positive integer" });
      return;
    }

    const reviews = await prisma.review.findMany({
      where: parsedProductId ? { productIt: parsedProductId.data } : undefined,
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ reviews: reviews.map(formatReview) });
  } catch (error) {
    next(error);
  }
});

routes.get("/products/:productId/reviews", async (req, res, next) => {
  try {
    const parsedProductId = productIdSchema.safeParse(req.params.productId);

    if (!parsedProductId.success) {
      res.status(400).json({ error: "productId must be a positive integer" });
      return;
    }

    const reviews = await prisma.review.findMany({
      where: {
        productIt: parsedProductId.data,
      },
      include: {
        product: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ reviews: reviews.map(formatReview) });
  } catch (error) {
    next(error);
  }
});
