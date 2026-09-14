import type { EagleBotDBClient } from "../client.database.ts";

export async function ensureServer(client:EagleBotDBClient, discordServerId:bigint) {
    await client.insertInto("server")
        .values({
            discordServerId
        })
        .onConflict((oc) => {
            return oc.doNothing();
        })
        .execute();
}