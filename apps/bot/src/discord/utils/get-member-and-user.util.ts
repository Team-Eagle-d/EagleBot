import type { BigString } from "@discordeno/bot";
import type { EagleBotMember, EagleBotType, EagleBotUser } from "../../core/index.ts";

export async function getMemberAndUser(bot:EagleBotType, discordServerId:BigString, discordUserId:BigString):Promise<[EagleBotMember, EagleBotUser]> {
    const member = await bot.helpers.getMember(discordServerId, discordUserId);
    const user = member.user ? member.user : await bot.helpers.getUser(discordUserId);

    return [member, user];
}