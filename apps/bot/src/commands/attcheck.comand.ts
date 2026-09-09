// attcheck: attendance check

// Discordeno
import { createEmbeds, DiscordInteractionContextType } from "@discordeno/bot";

// @eaglebot/types
import { CommandVisualData } from "@eaglebot/types/bot";

// @eaglebot/constants
import { CategoryType } from "@eaglebot/constants/bot";

// database-thingie
import { attendance, serverUser } from "@eaglebot/database";
import { client, ensureServerUser, getAttendanceCount, increment, isAttendanceStreak } from "../database/index.ts";
import { and, eq } from "drizzle-orm";

// eaglebot derived types
import { EagleBotCommandFileDefault } from "../core/index.ts";

// discord
import { getMemberAvatarUrl } from "../discord/index.ts";
import { sendLevelUp } from "../discord/index.ts";

// logic
import { MONEY_GAIN } from "../logic/money/money.constant.ts";
import { calcLevelUpData, getXpGain } from "../logic/level/level.logic.ts";

export const id = "attcheck";

export const commandVisualData:CommandVisualData = {
    "name": "attcheck",
    "category": CategoryType.GENERAL
};

function _getFormattedDateString(standardTimeDate:Date, timeZone:string):`${string}-${string}-${string}` {
    // locale은 임의로 한국 기준으로 맞추었습니다.
    const parts = new Intl.DateTimeFormat("ko-KR", {
        timeZone: timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).formatToParts(standardTimeDate);

    const date = `${
        parts.find((v) => {
            return v.type === "year";
        })!.value
    }-${
        parts.find((v) => {
            return v.type === "month";
        })!.value
    }-${
        parts.find((v) => {
            return v.type === "day";
        })!.value
    }` as const;

    return date;
}

export default {
    getCommandData() {
        return {
            name: "attcheck",
            description: "출석하기",
            contexts: [
                DiscordInteractionContextType.Guild // 당연하게도 서버 온리입니다.
            ]
        };
    },
    async execute(_, interaction, botData) {
        const now = Date.now();

        await interaction.defer();

        const discordServerId = interaction.guild.id;
        const discordUserId = interaction.user.id;

        // FK로 물리적인 관계가 있는 테이블은 그 로우가 존재하지 않을 경우 INSERT가 안 된다 하더라구요.
        await ensureServerUser(
            discordServerId,
            discordUserId
        );

        // 초기: 한국 시간 기준으로 작업합니다.
        const standardTime = new Date(now);
        const newAttendanceCheck = await client.insert(attendance)
            .values({
                discordServerId,
                discordUserId,
                attendanceDate: _getFormattedDateString(standardTime, "Asia/Seoul"),
                checkedAt: standardTime,
            })
            .onConflictDoNothing()
            .returning();

        // 만약 이미 있는 PK 조합으로 충돌되었을 경우 빈 리스트로 반환됩니다.
        // (ON CONFLICT DO NOTHING)
        if(newAttendanceCheck.length <= 0) {
            // 어딜감히한번더출석하려고
            interaction.respond({
                content: "오늘은 이미 출석체크했어요!"
            });

            return;
        }

        // 로우가 하나밖에 없다면 바로 가져오는 것이 편할 테니 말이죠.
        const curServerUser = (
            await client.select({
                level: serverUser.level,
                xp: serverUser.xp,
                money: serverUser.money,
                attendanceStreak: serverUser.attendanceStreak
            }).from(serverUser)
                .where(and(
                    eq(serverUser.discordServerId, discordServerId),
                    eq(serverUser.discordUserId, discordUserId)
                ))
        )[0];

        // 알고 보니 streak가 맞더라구요
        // steak인 줄 알았던 빡빡이 청년
        const attendanceStreak = await isAttendanceStreak(discordServerId, discordUserId);
        const newAttendanceStreak = attendanceStreak ? curServerUser.attendanceStreak + 1 : 1;

        const xpGain = getXpGain(newAttendanceStreak);
        const levelUpData = calcLevelUpData(curServerUser.level, curServerUser.xp, xpGain);

        // 고정해서 수정해야 하는 요소는 그대로 넣고,
        // 상승시켜야 하는 요소는 increment 함수로 묶어 보냈습니다.
        await client.update(serverUser)
            .set({
                level: increment(serverUser.level, levelUpData.calcIncrementLevel),
                xp: levelUpData.calcXp,
                money: increment(serverUser.money, MONEY_GAIN),
                attendanceStreak: newAttendanceStreak
            })
            .where(and(
                eq(serverUser.discordServerId, interaction.guild.id),
                eq(serverUser.discordUserId, interaction.user.id)
            ));

        let description = `-# *${await getAttendanceCount(discordServerId, discordUserId)}번째 출석체크*`;
        if(attendanceStreak) {
            description += ` ***(${newAttendanceStreak} 연속)***`;
        }
        
        // 함수로 분리하기 귀찮더라구요.
        // 분리할 시 그 만큼 넣어줘야 하는 인자도 많아지는데,
        // 그렇게 해서 얻는 시각적/성능적 이점도 없고.
        // if 분기로 나뉘는 것도 아니잖아요?
        const embeds = createEmbeds().setTitle("출석체크 완료!")
            .setDescription(description)
            .setThumbnail(getMemberAvatarUrl(discordServerId, discordUserId, interaction.member!, interaction.user))
            .setColor(botData.eaglebotColor)
            .setTimestamp(now);

        // 현재 단계에서는 xp와 돈을 고정으로 넣습니다.
        embeds.addField(
            "출석 보상", [
                `**xp**: **+${xpGain}**`,
                `**돈**: **+${MONEY_GAIN}**`
            ].join("\n"),
            false
        );

        await interaction.respond({
            embeds
        });

        if(levelUpData.calcIncrementLevel > 0) {
            await sendLevelUp(
                levelUpData.calcLevel,
                levelUpData.calcXp,
                {
                    type: "interaction",
                    respond: interaction.respond.bind(interaction)
                }
            );
        }
    }
} satisfies EagleBotCommandFileDefault;