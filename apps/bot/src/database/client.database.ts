import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export const client = drizzle(postgres(Deno.env.get("DATABASE_URL")!));