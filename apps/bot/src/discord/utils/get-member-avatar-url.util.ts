import { avatarUrl, memberAvatarUrl } from "@discordeno/bot";
import { EagleBotMember, EagleBotUser } from "../../core/index.ts";

/**
 * memberAvatarUrl Discordeno 함수의 안전한 버전입니다.
 * 서버 아바타 url이 없다면 유저 아바타 url을 반환합니다.
 */
export function getMemberAvatarUrl(discordServerId:bigint, discordUserId:bigint, member:Pick<EagleBotMember, "avatar">, user:Pick<EagleBotUser, "avatar" | "discriminator">) {
    return memberAvatarUrl(discordServerId, discordUserId, {
        avatar: member.avatar
    }) ?? avatarUrl(discordUserId, user.discriminator, {
        avatar: user.avatar
    });
}