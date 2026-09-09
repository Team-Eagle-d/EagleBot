import { serverUser } from "@eaglebot/database";
import { client } from "../client.database.ts";
import { ensureServer } from "../init/ensure-server.util.ts";
import { ensureUser } from "../init/ensure-user.util.ts";

/**
 * Server와 User 모두 존재해야 ServerUser를 초기화할 수 있기 때문에,
 * 이 함수에서는 Server와 User도 모두 존재한다 보장합니다.
 */
export async function ensureServerUser(discordServerId:bigint, discordUserId:bigint) {
    await Promise.all([
        ensureServer(discordServerId),
        ensureUser(discordUserId)
    ]);

    await client.insert(serverUser)
        .values({
            discordServerId,
            discordUserId,
            level: 0,
            xp: 0n,
            money: 0n
        })
        .onConflictDoNothing();
}