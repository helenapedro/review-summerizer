import type { RequestHandler } from "express";
import { productService } from "../services/productService";

export const productController = {
  getProducts: (async (_req, res, next) => {
    try {
      const products = await productService.getProducts();

      res.json({ products });
    } catch (error) {
      next(error);
    }
  }) satisfies RequestHandler,
};
