import { Router } from "express";
import { summaryController } from "../controllers/summaryController";

export const summaryRoutes = Router();

summaryRoutes.get("/products/:productId/summary", summaryController.getProductSummary);
summaryRoutes.post(
  "/products/:productId/summary",
  summaryController.summarizeProductReviews,
);
