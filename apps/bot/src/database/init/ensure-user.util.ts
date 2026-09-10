import { user } from "@eaglebot/database";
import type { EagleBotDBClient } from "../client.database.ts";

export async function ensureUser(client:EagleBotDBClient, discordUserId:bigint) {
    await client.insert(user)
        .values({
            discordUserId
        })
        .onConflictDoNothing();
}