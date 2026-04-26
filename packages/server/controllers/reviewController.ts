import type { RequestHandler } from "express";
import { reviewService } from "../services/reviewService";
import {
  parseProductId,
  productIdErrorMessage,
} from "../validators/requestValidation";

export const reviewController = {
  getReviews: (async (req, res, next) => {
    try {
      const productId =
        req.query.productId === undefined
          ? undefined
          : parseProductId(req.query.productId);

      if (req.query.productId !== undefined && productId === undefined) {
        res.status(400).json({ error: productIdErrorMessage });
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
        res.status(400).json({ error: productIdErrorMessage });
        return;
      }

      const reviews = await reviewService.getProductReviews(productId);

      res.json({ reviews });
    } catch (error) {
      next(error);
    }
  }) satisfies RequestHandler,
};
