// Discordeno
import { /* ApplicationCommandOptionTypes, */ createEmbeds, DiscordInteractionContextType, type FileContent } from "@discordeno/bot";

// @eaglebot/types
import type { CommandVisualData } from "@eaglebot/types/bot";

// @eaglebot/constants
import { CategoryType } from "@eaglebot/constants/bot";

// database-thingie
import { serverUser } from "@eaglebot/database";
import { client } from "../database/index.ts";
import { desc, eq } from "drizzle-orm";

// eaglebot derived types
import type { EagleBotCommandFileDefault } from "../core/index.ts";

// eaglebot-specific constants
import { UNKNOWN_IMAGE_ATTACHMENT_NAME, UNKNOWN_IMAGE_PATH } from "../constants/index.ts";

// discord
import { getGuildIconUrl, getMemberAndUser } from "../discord/index.ts";

// logic
import { RANK_MEDAL } from "../logic/rank/rank.constant.ts";

export const id = "rank";

export const commandVisualData:CommandVisualData = {
    "name": "rank",
    "category": CategoryType.GENERAL
};

// 현재 단계에서는 레벨-경험치 랭킹만을 구현합니다.
// 근데그게인라인일뿐인거지
export default {
    getCommandData() {
        return {
            name: "rank",
            description: "랭킹 확인하기",
            contexts: [
                DiscordInteractionContextType.Guild
            ],
            // 나중에 상위 몇 위까지인지를 표시하도록 합시다.
            // 지금은 상위 10위 고정입니다.
            // options: [
            //     {
            //         name: "",
            //         description: "",
            //         type: ApplicationCommandOptionTypes.Integer,
                    
            //     }
            // ]
        };
    },
    async execute(bot, interaction, botData) {
        const now = Date.now();
        
        await interaction.defer();

        const discordServerId = interaction.guild.id;

        const rank = await client.select().from(serverUser)
            .where(eq(serverUser.discordServerId, discordServerId))
            .orderBy(desc(serverUser.level), desc(serverUser.xp), serverUser.discordUserId)
            .limit(10);

        if(rank.length <= 0) {
            await interaction.respond({
                content: "*이 서버에서는 아무도 참가하지 않으셨어요 :(*"
            });

            return;
        }

        const guild = await bot.helpers.getGuild(discordServerId);

        const [
            isGuildIcon,
            iconUrl
        ] = getGuildIconUrl(discordServerId, guild.icon);

        let responseFile:{
            files:FileContent[]
        } | undefined;
        if(!isGuildIcon) {
            const fileData = await Deno.readFile(UNKNOWN_IMAGE_PATH);
            const blob = new Blob([fileData], {
                type: "image/png"
            });

            responseFile = {
                files: [
                    {
                        name: UNKNOWN_IMAGE_ATTACHMENT_NAME,
                        blob
                    }
                ]
            };
        }

        const embeds = createEmbeds().setTitle(`**${guild.name}** 서버 랭킹`)
            .setDescription(`-# ***${"레벨-경험치"}** (상위 ${10}명)*`)
            .setThumbnail(iconUrl)
            .setColor(botData.eaglebotColor)
            .setTimestamp(now);

        const promises:ReturnType<typeof getMemberAndUser>[] = [];
        for(let i = 0; i < rank.length; i++) {
            const rankUser = rank[i];
            promises.push(getMemberAndUser(bot, discordServerId, rankUser.discordUserId));
        }
            
        const memberAndUsers = await Promise.all(promises);

        for(let i = 0; i < 3; i++) {
            const memberAndUser = memberAndUsers[i];
            if(!memberAndUser) {
                break;
            }

            const [
                curMember,
                curUser
            ] = memberAndUser;

            embeds.addField(
                `${i + 1}위 ${RANK_MEDAL[i]}`,
                `**${curMember.nick ?? curUser.globalName ?? curUser.username}**`,
                false
            );
        }

        if(rank.length > 3) {
            const rankTexts:string[] = [];
            for(let i = 3; i < rank.length; i++) {
                const [
                    curMember,
                    curUser
                ] = memberAndUsers[i];

                rankTexts.push(`${i + 1}위 - **${curMember.nick ?? curUser.globalName ?? curUser.username}**`);
            }

            embeds.addField(
                "나머지",
                rankTexts.join("\n"),
                false
            );
        }

        await interaction.respond({
            embeds,
            ...responseFile
        });
    }
} satisfies EagleBotCommandFileDefault;