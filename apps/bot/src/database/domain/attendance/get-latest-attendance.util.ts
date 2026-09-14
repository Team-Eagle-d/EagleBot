import type { EagleBotDBClient } from "../../client.database.ts";

export async function getLatestAttendance(client:EagleBotDBClient, discordServerId:bigint, discordUserId:bigint) {
    return await client.selectFrom("attendance")
        .selectAll()
        .where("discordServerId", "=", discordServerId)
        .where("discordUserId", "=", discordUserId)
        .orderBy("checkedAt", "desc")
        .executeTakeFirst();
}