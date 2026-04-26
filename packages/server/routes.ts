import { Router } from "express";
import { reviewRoutes } from "./routes/reviewRoutes";

export const routes = Router();

routes.use(reviewRoutes);
