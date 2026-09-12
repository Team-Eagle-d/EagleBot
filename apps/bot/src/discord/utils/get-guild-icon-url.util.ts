import { type BigString, guildIconUrl } from "@discordeno/bot";
import { UNKNOWN_IMAGE_ATTACHMENT_URL } from "../../constants/index.ts";

/**
 * guildIconUrl Discordeno 함수의 안전한 버전입니다.
 * 성공 여부와 함께 url을 반환합니다.
 * 서버 아이콘이 없다면 "unknown" 이미지를 반환합니다.
 */
export function getGuildIconUrl(discordServerId:BigString, iconHash:bigint | undefined):[boolean, string] {
    const iconUrl = guildIconUrl(discordServerId, iconHash);
    if(iconUrl) {
        return [true, iconUrl];
    }   

    return [false, UNKNOWN_IMAGE_ATTACHMENT_URL];
}