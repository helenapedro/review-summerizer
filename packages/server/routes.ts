import { Router } from "express";
import { reviewRoutes } from "./routes/reviewRoutes";
import { summaryRoutes } from "./routes/summaryRoutes";

export const routes = Router();

routes.use(reviewRoutes);
routes.use(summaryRoutes);
