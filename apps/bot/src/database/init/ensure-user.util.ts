import { user } from "@eaglebot/database";
import { client } from "../client.database.ts";

export async function ensureUser(discordUserId:bigint) {
    await client.insert(user)
        .values({
            discordUserId
        })
        .onConflictDoNothing();
}