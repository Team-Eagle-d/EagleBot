import type { BigString, CreateMessageOptions, InteractionCallbackData } from "@discordeno/bot";
import type { EagleBotInteraction, EagleBotType } from "../../../core/index.ts";
import { getLevelUpRequiredXp } from "../../../logic/level/level.logic.ts";

type SendLevelUpTarget = _SendLevelUpTargetInteraction | _SendLevelUpTargetChannel;
type _SendLevelUpTargetInteraction = {
    type: "interaction",
    respond:EagleBotInteraction["respond"],
    response?:Omit<InteractionCallbackData, "content">,
    options?:{
        isPrivate?: boolean,
        withResponse?: boolean
    }
};
type _SendLevelUpTargetChannel = {
    type: "channel",
    send:EagleBotType["helpers"]["sendMessage"],
    channelId:BigString,
    options:Omit<CreateMessageOptions, "content">
};

export async function sendLevelUp(
    curLevel:number,
    curXp:bigint,
    target:SendLevelUpTarget
) {
    const content = [
        "## 레벨업했습니다!",
        `*현재 레벨*: *${curLevel}*`,
        `*현재 경험치*: *${curXp}*/*${getLevelUpRequiredXp(curLevel)}*`
    ].join("\n");

    switch(target.type) {
        case "interaction":
            return await target.respond(
                {
                    content,
                    ...target.response
                },
                target.options
            );;

        case "channel":
            return await target.send(target.channelId, {
                content,
                ...target.options
            });
    }
}