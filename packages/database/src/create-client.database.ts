import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

export function createClient(dbUrl:string) {
    return drizzle(postgres(dbUrl));
}