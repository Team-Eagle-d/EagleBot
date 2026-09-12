// Discordeno
import { ApplicationCommandOptionTypes, createEmbeds, DiscordInteractionContextType } from "@discordeno/bot";

// @eaglebot/types
import type { CommandVisualData } from "@eaglebot/types/bot";

// @eaglebot/utils
import { getFormattedDateString } from "@eaglebot/utils";

// database-thingie
import { client, ensureServerUser, getAttendanceCount, getLatestAttendance } from "../database/index.ts";
import { serverUser } from "@eaglebot/database";
import { and, eq } from "drizzle-orm";

// eaglebot derived types
import type { EagleBotCommandFileDefault, EagleBotMember, EagleBotUser } from "../core/index.ts";

// discord
import { getMemberAndUser, getMemberAvatarUrl } from "../discord/index.ts";

// logic
import { getLevelUpRequiredXp } from "../logic/level/level.logic.ts";

export const id = "profile";

export const commandVisualData:CommandVisualData = {
    "name": "profile",
    "category": "일반"
};

export default {
    getCommandData() {
        return {
            name: "profile",
            description: "프로필 확인하기",
            contexts: [
                DiscordInteractionContextType.Guild
            ],
            options: [
                {
                    type: ApplicationCommandOptionTypes.User,
                    name: "member",
                    description: "확인할 유저를 고르세요. (기본: 자기 자신)",
                }
            ]
        };
    },
    async execute(bot, interaction, botData) {
        const now = Date.now();

        await interaction.defer();

        const discordServerId = interaction.guild.id;

        const selectedDiscordUserId = interaction.data?.options?.[0]?.value as string | undefined;

        let selectedDiscordMember:EagleBotMember;
        let selectedDiscordUser:EagleBotUser;
        if(!selectedDiscordUserId || selectedDiscordUserId === String(interaction.user.id)) {
            selectedDiscordMember = interaction.member!;
            selectedDiscordUser = interaction.user;
        }
        else {
            const memberAndUser = await getMemberAndUser(bot, discordServerId, selectedDiscordUserId);
            selectedDiscordMember = memberAndUser[0];
            selectedDiscordUser = memberAndUser[1];
        }

        const discordUserId = selectedDiscordMember.id;

        const [
            selectedServerUser,
            selectedLatestAttendance
        ] = await client.transaction(async (transaction) => {
            await ensureServerUser(transaction, discordServerId, discordUserId);
            const [selectedServerUser] = await transaction.select().from(serverUser)
                .where(and(
                    eq(serverUser.discordServerId, discordServerId),
                    eq(serverUser.discordUserId, discordUserId)
                ));

            const selectedLatestAttendance = await getLatestAttendance(transaction, discordServerId, discordUserId);

            return [selectedServerUser, selectedLatestAttendance];
        });
        
        const embeds = createEmbeds().setTitle(selectedDiscordMember.nick ?? selectedDiscordUser.globalName ?? selectedDiscordUser.username)
            .setThumbnail(getMemberAvatarUrl(discordServerId, discordUserId, selectedDiscordMember, selectedDiscordUser))
            .setColor(botData.eaglebotColor)
            .setTimestamp(now);
        
        // 서로 연관되어 있는 합쳐져야 합니다.
        // 그 외의 나머지 필드가 합쳐져야 할 필요는 없구요.
        embeds.addField(
                "레벨",
                `**${selectedServerUser.level}LV**`,
                true
            )
            .addField(
                "경험치",
                `**${selectedServerUser.xp}**/**${getLevelUpRequiredXp(selectedServerUser.level)}**`,
                true
            );

        embeds.addField(
                "돈",
                `**${selectedServerUser.money}원**`,
                false
            );
        
        let attendanceCountDescription = `**${await getAttendanceCount(client, discordServerId, discordUserId)}번**`;
        if(selectedServerUser.attendanceStreak > 1) {
            attendanceCountDescription += ` ***(${selectedServerUser.attendanceStreak}연속)***`;
        }
        embeds.addField(
                "출석체크 횟수",
                attendanceCountDescription,
                true
            )
            .addField(
                "최근 출석체크",
                selectedLatestAttendance ? `**${selectedLatestAttendance.attendanceDate}**` : "*출석 없음*",
                true
            );

        // 아마도 그 나머지 중 하나들
        embeds.addField(
                "서버 참가 날짜",
                `**${getFormattedDateString(new Date(selectedDiscordMember.joinedAt), "UTC")}**`,
                false
            );

        await interaction.respond({
            embeds
        });
    }
} satisfies EagleBotCommandFileDefault;