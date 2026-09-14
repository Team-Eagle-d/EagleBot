import { CamelCasePlugin, Kysely } from "kysely";
import { PostgresJSDialect } from "kysely-postgres-js";
import postgres from "postgres";
import type { Database } from "./database.type.ts";

export function createClient(dbUrl:string) {
    return new Kysely<Database>({
        dialect: new PostgresJSDialect({
            postgres: postgres(dbUrl)
        }),
        plugins: [
            new CamelCasePlugin()
        ]
    });
}