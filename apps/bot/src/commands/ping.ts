import { createEmbeds, EmbedsBuilder } from "@discordeno/bot";
import type { EagleBotCommandFile } from "../eaglebot.ts";
import { calcPerformance } from "../utility/calc-performance.ts";
import { getDuration } from "../utility/get-duration.ts";

type _GetEmbedsData = {
    readonly performance:number,
    readonly roundTripTime?:number,
    readonly upTimeDuration:string,
    readonly now:number
};
export function _getEmbeds(success:boolean, embedData:_GetEmbedsData):EmbedsBuilder {
    const title = "퐁!";
    const description = "저 아직 살아 있어요!";
    const latencyText = `**${embedData.performance}ms**`;
    const rttText = success ? `**${embedData.roundTripTime ?? "?"}ms**` : "***측정하지 못 했어요 :(***";

    const embeds = createEmbeds().setTitle(title)
        .setDescription(description)
        .addField("지연", latencyText, false)
        .addField("서버 지연(Heartbeat RTT)", rttText, false)
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
        const { performance } = await calcPerformance(interaction.defer.bind(interaction), false);

        const totalShards = bot.gateway.calculateTotalShards();
        const shardId = bot.gateway.calculateShardId(interaction.guild.id, totalShards);
        const shard = bot.gateway.shards.get(shardId);

        let embeds:EmbedsBuilder;
        const now = Date.now();
        if(shard === undefined) {
            bot.logger.error(`[ping Application Command]: ${shardId}번 shard를 찾을 수 없습니다.`)
            embeds = _getEmbeds(false, {
                performance,
                roundTripTime: 0,
                upTimeDuration: getDuration(now - botData.upTimeStart),
                now
            });
        }
        else {
            embeds = _getEmbeds(true, {
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