import express from "express";
import { env } from "./config/env";
import { routes } from "./routes";

export const app = express();

app.use(express.json({ limit: env.JSON_BODY_LIMIT }));
app.use(routes);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(
  (
    error: unknown,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  },
);
