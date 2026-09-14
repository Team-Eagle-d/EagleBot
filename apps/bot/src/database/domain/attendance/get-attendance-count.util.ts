import type { EagleBotDBClient } from "../../client.database.ts";

/**
 * 총 출석 횟수를 가져옵니다.
 */
export async function getAttendanceCount(client:EagleBotDBClient, discordServerId:bigint, discordUserId:bigint):Promise<number> {
    const result = await client.selectFrom("attendance")
        .select(({ fn }) => {
            return [
                fn.countAll<number>()
                    .as("count")
            ];
        })
        .where("discordServerId", "=", discordServerId)
        .where("discordUserId", "=", discordUserId)
        .executeTakeFirstOrThrow();

    return result.count;
}