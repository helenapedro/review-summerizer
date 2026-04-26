import type { RequestHandler } from "express";
import { z } from "zod";
import { reviewService } from "../services/reviewService";

const productIdSchema = z.coerce.number().int().positive();

const parseProductId = (value: unknown) => {
  const parsedProductId = productIdSchema.safeParse(value);

  if (!parsedProductId.success) {
    return undefined;
  }

  return parsedProductId.data;
};

export const reviewController = {
  getReviews: (async (req, res, next) => {
    try {
      const productId =
        req.query.productId === undefined
          ? undefined
          : parseProductId(req.query.productId);

      if (req.query.productId !== undefined && productId === undefined) {
        res.status(400).json({ error: "productId must be a positive integer" });
        return;
      }

      const reviews = await reviewService.getReviews(productId);

      res.json({ reviews });
    } catch (error) {
      next(error);
    }
  }) satisfies RequestHandler,

  getProductReviews: (async (req, res, next) => {
    try {
      const productId = parseProductId(req.params.productId);

      if (productId === undefined) {
        res.status(400).json({ error: "productId must be a positive integer" });
        return;
      }

      const reviews = await reviewService.getProductReviews(productId);

      res.json({ reviews });
    } catch (error) {
      next(error);
    }
  }) satisfies RequestHandler,
};
