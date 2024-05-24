import { z } from "zod";
import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

const envSchema = z.object({
  DATABASE_URL: z.string().url().min(1),
});

export const env = envSchema.parse(process.env);
