import { env } from "./src/env";
import { defineConfig } from "drizzle-kit";

console.log(env.DATABASE_URL);

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/index.ts",
  out: "./drizzle",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
