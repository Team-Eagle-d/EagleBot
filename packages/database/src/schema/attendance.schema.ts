import { pgTable } from "drizzle-orm/pg-core/table";
import { bigint, date, primaryKey, timestamp } from "drizzle-orm/pg-core";
import { server } from "./server.schema.ts";
import { user } from "./user.schema.ts";

export const attendance = pgTable(
    "attendance",
    {
        discordServerId: bigint("discord_server_id", {
            mode: "bigint"
        }).notNull()
            .references(() => server.discordServerId),
        discordUserId: bigint("discord_user_id", {
            mode: "bigint"
        }).notNull()
            .references(() => user.discordUserId),
        attendanceDate: date("attendance_date").notNull(),
        checkedAt: timestamp("checked_at").notNull()
    },
    (table) => {
        return [
            primaryKey({
                name: "attendance_pk",
                columns: [
                    table.discordServerId,
                    table.discordUserId,
                    table.attendanceDate
                ]
            })
        ];
    }
);