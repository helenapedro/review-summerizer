import { Router } from "express";
import { productRoutes } from "./routes/productRoutes";
import { reviewRoutes } from "./routes/reviewRoutes";
import { summaryRoutes } from "./routes/summaryRoutes";

export const routes = Router();

routes.use(productRoutes);
routes.use(reviewRoutes);
routes.use(summaryRoutes);
