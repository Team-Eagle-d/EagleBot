import { attendance } from "@eaglebot/database";
import type { EagleBotDBClient } from "../../client.database.ts";
import { and, desc, eq } from "drizzle-orm";

export async function getLatestAttendance(client:EagleBotDBClient, discordServerId:bigint, discordUserId:bigint) {
    const result = await client.select().from(attendance)
        .where(and(
            eq(attendance.discordServerId, discordServerId),
            eq(attendance.discordUserId, discordUserId)
        ))
        .orderBy(desc(attendance.checkedAt))
        .limit(1);

    if(result.length <= 0) {
        return undefined;
    }

    return result[0];
}