import type { RequestHandler } from "express";
import { z } from "zod";
import { summaryService } from "../services/summaryService";

const productIdSchema = z.coerce.number().int().positive();
const forceSchema = z
  .enum(["true", "false"])
  .optional()
  .transform((value) => value === "true");

const parseProductId = (value: unknown) => {
  const parsedProductId = productIdSchema.safeParse(value);

  if (!parsedProductId.success) {
    return undefined;
  }

  return parsedProductId.data;
};

export const summaryController = {
  getProductSummary: (async (req, res, next) => {
    try {
      const productId = parseProductId(req.params.productId);

      if (productId === undefined) {
        res.status(400).json({ error: "productId must be a positive integer" });
        return;
      }

      const summary = await summaryService.getProductSummary(productId);

      res.json({ summary });
    } catch (error) {
      next(error);
    }
  }) satisfies RequestHandler,

  summarizeProductReviews: (async (req, res, next) => {
    try {
      const productId = parseProductId(req.params.productId);
      const parsedForce = forceSchema.safeParse(req.query.force);

      if (productId === undefined) {
        res.status(400).json({ error: "productId must be a positive integer" });
        return;
      }

      if (!parsedForce.success) {
        res.status(400).json({ error: "force must be true or false" });
        return;
      }

      const result = await summaryService.summarizeProductReviews(
        productId,
        parsedForce.data,
      );

      res.json(result);
    } catch (error) {
      next(error);
    }
  }) satisfies RequestHandler,
};
