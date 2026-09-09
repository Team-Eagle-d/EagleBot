import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.ts";

export function createClient(dbUrl:string) {
    return drizzle(postgres(dbUrl), { schema });
}