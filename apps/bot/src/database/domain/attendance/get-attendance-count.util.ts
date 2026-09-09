import { and, count, eq } from "drizzle-orm";
import { client } from "../../client.database.ts";
import { attendance } from "@eaglebot/database";

/**
 * 총 출석 횟수를 가져옵니다.
 */
export async function getAttendanceCount(discordServerId:bigint, discordUserId:bigint):Promise<number> {
    return (
        await client.select({
            count: count()
        }).from(attendance)
            .where(and(
                eq(attendance.discordServerId, discordServerId),
                eq(attendance.discordUserId, discordUserId)
            ))
    )[0].count!;
}