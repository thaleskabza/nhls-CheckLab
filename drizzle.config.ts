//drizzle.config.ts

import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: ["./apps/packages/infra/db/schema.ts"],
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
