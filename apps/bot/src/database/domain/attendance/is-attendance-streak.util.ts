import { attendance } from "@eaglebot/database";
import { client } from "../../client.database.ts";
import { and, desc, eq } from "drizzle-orm";

/**
 * 연속 출석인 경우: true, 끊어진 경우: false
 */
export async function isAttendanceStreak(discordServerId:bigint, discordUserId:bigint):Promise<boolean> {
    const attendanceChecks = (
        await client.select({
            attendanceDate: attendance.attendanceDate
        }).from(attendance)
            .where(and(
                eq(attendance.discordServerId, discordServerId),
                eq(attendance.discordUserId, discordUserId)
            ))
            .orderBy(desc(attendance.attendanceDate))
            .limit(2)
    );

    if(attendanceChecks.length <= 1) {
        return false;
    }

    const past = attendanceChecks[1]!.attendanceDate!;
    const now = attendanceChecks[0]!.attendanceDate;

    const pastDate = new Date(`${past}T00:00:00Z`);
    pastDate.setUTCDate(pastDate.getUTCDate() + 1);

    return pastDate.getTime() === new Date(`${now}T00:00:00Z`).getTime();
}