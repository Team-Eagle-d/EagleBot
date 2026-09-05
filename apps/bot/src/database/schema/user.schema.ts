import { pgTable } from "drizzle-orm/pg-core/table";
import { bigint, integer } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
    id: integer().generatedAlwaysAsIdentity()
        .primaryKey(),
    discordUserId: bigint("discord_user_id", {
        mode: "bigint"
    }).unique()
        .notNull()
});