import { pgTable } from "drizzle-orm/pg-core/table";
import { bigint, integer, primaryKey } from "drizzle-orm/pg-core";
import { user } from "./user.schema.ts";
import { server } from "./server.schema.ts";

export const serverUser = pgTable(
    "server_user",
    {
        discordServerId: bigint("discord_server_id", {
            mode: "bigint"
        }).notNull()
            .references(() => server.discordServerId),
        discordUserId: bigint("discord_user_id", {
            mode: "bigint"
        }).notNull()
            .references(() => user.discordUserId),
        level: integer().default(0)
            .notNull(),
        xp: bigint({
            mode: "bigint"
        }).default(0n)
            .notNull(),
        money: bigint({
            mode: "bigint"
        }).default(0n)
            .notNull()
    },
    (table) => {
        return [
            primaryKey({
                name: "server_user_pk",
                columns: [
                    table.discordServerId,
                    table.discordUserId
                ]
            })
        ];
    }
);