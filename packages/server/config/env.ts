import "dotenv/config";
import z from "zod";

const emptyStringToUndefined = (value: unknown) => {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }

  return value;
};

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  OPENAI_API_KEY: z.preprocess(
    emptyStringToUndefined,
    z.string().trim().optional(),
  ),
  OPEN_API_KEY: z.preprocess(
    emptyStringToUndefined,
    z.string().trim().optional(),
  ),
  SUMMARIZER_MODEL: z.preprocess(
    emptyStringToUndefined,
    z.string().trim().default("gpt-5.4-mini"),
  ),
  SUMMARY_TTL_HOURS: z.preprocess(
    emptyStringToUndefined,
    z.coerce.number().int().positive().default(24),
  ),
  SUMMARY_REVIEW_LIMIT: z.preprocess(
    emptyStringToUndefined,
    z.coerce.number().int().min(1).max(50).default(20),
  ),
  //    HELENA_EXPLORA_SITE_URL: z.preprocess(
  //       emptyStringToUndefined,
  //       z.string().trim().url('HELENA_EXPLORA_SITE_URL must be a valid URL')
  //    ),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  CLIENT_ORIGIN: z.preprocess(
    emptyStringToUndefined,
    z.string().trim().default("http://localhost:5173"),
  ),
  JSON_BODY_LIMIT: z.preprocess(
    emptyStringToUndefined,
    z.string().trim().default("16kb"),
  ),
  //    RATE_LIMIT_WINDOW_MS: z.preprocess(
  //       emptyStringToUndefined,
  //       z.coerce.number().int().positive().default(60_000)
  //    ),
  //    RATE_LIMIT_MAX_REQUESTS: z.preprocess(
  //       emptyStringToUndefined,
  //       z.coerce.number().int().positive().default(30)
  //    ),
  //    RETENTION_DAYS: z.preprocess(
  //       emptyStringToUndefined,
  //       z.coerce.number().int().positive().default(90)
  //    ),
  //    TRUST_PROXY: z.preprocess(
  //       emptyStringToUndefined,
  //       z
  //          .union([z.literal('true'), z.literal('false')])
  //          .default('false')
  //          .transform((value) => value === 'true')
  //    ),
  //    CHATBOT_ENCRYPTION_KEY: z.preprocess(
  //       emptyStringToUndefined,
  //       z
  //          .string()
  //          .trim()
  //          .regex(
  //             /^[a-f0-9]{64}$/i,
  //             'CHATBOT_ENCRYPTION_KEY must be a 64-character hex string'
  //          )
  //    ),
  SUMMERIZER_DB_HOST: z.preprocess(
    emptyStringToUndefined,
    z.string().trim().min(1, "SUMMERIZER_DB_HOST is required"),
  ),
  SUMMERIZER_DB_PORT: z.preprocess(
    emptyStringToUndefined,
    z.coerce.number().int().min(1).max(65535).default(3306),
  ),
  SUMMERIZER_DB_NAME: z.preprocess(
    emptyStringToUndefined,
    z.string().trim().min(1, "SUMMERIZER_DB_NAME is required"),
  ),
  SUMMERIZER_DB_USER: z.preprocess(
    emptyStringToUndefined,
    z.string().trim().min(1, "SUMMERIZER_DB_USER is required"),
  ),
  SUMMERIZER_DB_PASSWORD: z.preprocess(
    emptyStringToUndefined,
    z.string().min(1, "SUMMERIZER_DB_PASSWORD is required"),
  ),
  SUMMERIZER_DB_CONNECTION_LIMIT: z.preprocess(
    emptyStringToUndefined,
    z.coerce.number().int().positive().default(10),
  ),
  DATABASE_URL: z.preprocess(
    emptyStringToUndefined,
    z.string().trim().url("DATABASE_URL must be a valid database URL"),
  ),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error("Invalid server environment configuration.");
  console.error(JSON.stringify(parsedEnv.error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

export const env = parsedEnv.data;
