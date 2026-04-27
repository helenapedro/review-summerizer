import type { RequestHandler } from "express";
import { env } from "../config/env";

export const cors: RequestHandler = (req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", env.CLIENT_ORIGIN);
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.sendStatus(204);
    return;
  }

  next();
};
