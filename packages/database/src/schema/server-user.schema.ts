import { pgTable } from "drizzle-orm/pg-core/table";
import { bigint, integer, primaryKey, timestamp } from "drizzle-orm/pg-core";
import { user } from "./user.schema.ts";
import { server } from "./server.schema.ts";
import { sql } from "drizzle-orm";

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
        }).default(sql`0`)
            .notNull(),
        money: bigint({
            mode: "bigint"
        }).default(sql`0`)
            .notNull(),
        createdAt: timestamp("created_at").notNull()
            .defaultNow(),
        updatedAt: timestamp("updated_at").notNull()
            .defaultNow()
            .$onUpdateFn(() => {
                return sql`CURRENT_TIMESTAMP`;
            })
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