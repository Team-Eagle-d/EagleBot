import { avatarUrl, createEmbeds, EmbedsBuilder, snowflakeToTimestamp } from "@discordeno/bot";
import type { EagleBotCommandFile } from "../eaglebot.ts";
import { getDuration } from "../utils/get-duration.ts";

type _GetEmbedsData = {
    readonly imgUrl:string,
    readonly color:number,
    readonly performance:number,
    readonly roundTripTime?:number,
    readonly upTimeDuration:string,
    readonly now:number
};
function _getEmbeds(isShardUndefined:boolean, embedData:_GetEmbedsData):EmbedsBuilder {
    const title = "퐁!";
    const description = "저 아직 살아 있어요!";
    const latencyText = `**${embedData.performance}ms**`;
    const rttText = isShardUndefined ? `**${embedData.roundTripTime ?? "?"}ms**` : "***측정하지 못 했어요 :(***";

    const embeds = createEmbeds().setTitle(title)
        .setDescription(description)
        .setThumbnail(embedData.imgUrl)
        .setColor(embedData.color)
        .addField("지연", latencyText, true)
        .addField("서버 지연(Heartbeat RTT)", rttText, true)
        .addField("봇 가동 시간", embedData.upTimeDuration, false)
        .setTimestamp(embedData.now);

    return embeds;
}

export default {
    id: "ping",
    getCommandData() {
        return {
            name: this.id,
            description: "\"퐁!\"으로 답장합니다."
        };
    },
    async execute(bot, interaction, botData) {
        const now = Date.now();

        await interaction.defer(false);

        const performance = now - snowflakeToTimestamp(interaction.id);

        const totalShards = bot.gateway.calculateTotalShards();
        const shardId = bot.gateway.calculateShardId(interaction.guild.id, totalShards);
        const shard = bot.gateway.shards.get(shardId);

        let embeds:EmbedsBuilder;
        if(shard === undefined) {
            bot.logger.error(`[ping Application Command]: ${shardId}번 shard를 찾을 수 없습니다.`)
            embeds = _getEmbeds(false, {
                imgUrl: avatarUrl(botData.me.id, botData.me.discriminator, {
                    avatar: botData.me.avatar
                }),
                color: botData.eaglebotColor,
                performance,
                roundTripTime: 0,
                upTimeDuration: getDuration(now - botData.upTimeStart),
                now
            });
        }
        else {
            embeds = _getEmbeds(true, {
                imgUrl: avatarUrl(botData.me.id, botData.me.discriminator, {
                    avatar: botData.me.avatar
                }),
                color: botData.eaglebotColor,
                performance,
                roundTripTime: shard.heart.rtt,
                upTimeDuration: getDuration(now - botData.upTimeStart),
                now
            });
        }

        await interaction.respond({
            embeds
        });
    }
} satisfies EagleBotCommandFile;