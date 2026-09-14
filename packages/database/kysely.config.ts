import { defineConfig, getKnexTimestampPrefix } from "kysely-ctl";
import { createClient } from "./src/create-client.database.ts";
import { type Migration, type MigrationProvider, Migrator } from "kysely/migration";

// Windows + Deno 환경에서 import 경로를 잘못 처리하더라구요.
// AI의 도움을 많이 받았습니다.
const provider:MigrationProvider = {
    async getMigrations() {
        const migrations:Record<string, Migration> = {};

        for await(const entry of Deno.readDir("./migrations")) {
            if(!entry.isFile || !entry.name.endsWith(".ts")) {
                continue;
            }

            const migrationName = entry.name.slice(0, -3);
            const migrationUrl = new URL(
                `./migrations/${entry.name}`,
                import.meta.url
            );

            const module = await import(migrationUrl.href);

            const migration = module.default ?? module;

            if(
                typeof migration !== "object" ||
                migration === null ||
                typeof migration.up !== "function"
            ) {
                continue;
            }

            migrations[migrationName] = migration;
        }

        return migrations;
    }
};

export default defineConfig({
    kysely: createClient(Deno.env.get("DATABASE_URL")!),
    migrations: {
        migrator(client) {
            return new Migrator({
                db: client,
                provider
            })
        },
        getMigrationPrefix: getKnexTimestampPrefix,
    }
});