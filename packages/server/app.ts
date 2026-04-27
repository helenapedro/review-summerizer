import express from "express";
import { env } from "./config/env";
import { cors } from "./middleware/cors";
import { errorHandler } from "./middleware/errorHandler";
import { routes } from "./routes";

export const app = express();

app.use(cors);
app.use(express.json({ limit: env.JSON_BODY_LIMIT }));
app.use(routes);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(errorHandler);
