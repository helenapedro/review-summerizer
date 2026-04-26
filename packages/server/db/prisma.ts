import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { env } from "../config/env";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaMariaDb(env.DATABASE_URL, {
  database: env.SUMMERIZER_DB_NAME,
});

export const prisma = new PrismaClient({ adapter });
