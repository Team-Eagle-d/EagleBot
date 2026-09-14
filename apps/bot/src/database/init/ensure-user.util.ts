import type { EagleBotDBClient } from "../client.database.ts";

export async function ensureUser(client:EagleBotDBClient, discordUserId:bigint) {
    await client.insertInto("user")
        .values({
            discordUserId
        })
        .onConflict((oc) => {
            return oc.doNothing();
        })
        .execute();
}