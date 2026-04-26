import { z } from "zod";

const productIdSchema = z.coerce.number().int().positive();

export const parseProductId = (value: unknown) => {
  const parsedProductId = productIdSchema.safeParse(value);

  if (!parsedProductId.success) {
    return undefined;
  }

  return parsedProductId.data;
};

export const forceRefreshSchema = z
  .enum(["true", "false"])
  .optional()
  .transform((value) => value === "true");

export const productIdErrorMessage = "productId must be a positive integer";
