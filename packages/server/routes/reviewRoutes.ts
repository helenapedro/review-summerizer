import { Router } from "express";
import { reviewController } from "../controllers/reviewController";

export const reviewRoutes = Router();

reviewRoutes.get("/reviews", reviewController.getReviews);
reviewRoutes.get("/products/:productId/reviews", reviewController.getProductReviews);
