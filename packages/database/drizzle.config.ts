import { defineConfig } from "drizzle-kit";

export default defineConfig({
    schema: "./src/schema/*.schema.ts",
    out: "./drizzle",
    dialect: "postgresql",
    dbCredentials: {
        url: Deno.env.get("DATABASE_URL")!
    }
});