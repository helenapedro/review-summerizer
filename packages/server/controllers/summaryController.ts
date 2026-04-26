import type { RequestHandler } from "express";
import { summaryService } from "../services/summaryService";
import {
  forceRefreshSchema,
  parseProductId,
  productIdErrorMessage,
} from "../validators/requestValidation";

export const summaryController = {
  getProductSummary: (async (req, res, next) => {
    try {
      const productId = parseProductId(req.params.productId);

      if (productId === undefined) {
        res.status(400).json({ error: productIdErrorMessage });
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
      const parsedForce = forceRefreshSchema.safeParse(req.query.force);

      if (productId === undefined) {
        res.status(400).json({ error: productIdErrorMessage });
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
