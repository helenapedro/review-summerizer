import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { env } from "../config/env";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaMariaDb(
  {
    host: env.SUMMERIZER_DB_HOST,
    port: env.SUMMERIZER_DB_PORT,
    user: env.SUMMERIZER_DB_USER,
    password: env.SUMMERIZER_DB_PASSWORD,
    database: env.SUMMERIZER_DB_NAME,
    connectionLimit: env.SUMMERIZER_DB_CONNECTION_LIMIT,
  },
  {
    database: env.SUMMERIZER_DB_NAME,
  },
);

export const prisma = new PrismaClient({ adapter });
