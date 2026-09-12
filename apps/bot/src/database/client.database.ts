import { createClient } from "@eaglebot/database";

export const client = createClient(Deno.env.get("DATABASE_URL")!);
export type EagleBotDBClient = Omit<typeof client, "$client">;