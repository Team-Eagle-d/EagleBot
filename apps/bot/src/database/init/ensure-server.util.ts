import { server } from "@eaglebot/database";
import type { EagleBotDBClient } from "../client.database.ts";

export async function ensureServer(client:EagleBotDBClient, discordServerId:bigint) {
    await client.insert(server)
        .values({
            discordServerId
        })
        .onConflictDoNothing();
}