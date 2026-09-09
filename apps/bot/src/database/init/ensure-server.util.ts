import { server } from "@eaglebot/database";
import { client } from "../client.database.ts";

export async function ensureServer(discordServerId:bigint) {
    await client.insert(server)
        .values({
            discordServerId
        })
        .onConflictDoNothing();
}