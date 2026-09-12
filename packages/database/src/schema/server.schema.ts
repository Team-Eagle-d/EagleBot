import { pgTable } from "drizzle-orm/pg-core/table";
import { bigint, integer } from "drizzle-orm/pg-core";

export const server = pgTable("server", {
    id: integer().generatedAlwaysAsIdentity()
        .primaryKey(),
    discordServerId: bigint("discord_server_id", {
        mode: "bigint"
    }).unique()
        .notNull()
});