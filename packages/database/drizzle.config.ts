import { defineConfig } from "drizzle-kit";
import { join } from "@std/path";

export default defineConfig({
    schema: join(import.meta.dirname, "./src/schema/*.schema.ts"),
    out: join(import.meta.dirname, "./drizzle"),
    dialect: "postgresql",
    dbCredentials: {
        url: Deno.env.get("DATABASE_URL")!
    }
});