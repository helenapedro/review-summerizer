import express from "express";
import { env } from "./config/env";

export const app = express();

app.use(express.json({ limit: env.JSON_BODY_LIMIT }));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});
