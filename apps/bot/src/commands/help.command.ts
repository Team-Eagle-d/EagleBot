// Discordeno
import { /* ApplicationCommandOptionChoice, ApplicationCommandOptionTypes, */ avatarUrl, createEmbeds } from "@discordeno/bot";

// @eaglebot/types
import type { CommandVisualData } from "@eaglebot/types/bot";

// @eaglebot/constants
import { CategoryType } from "@eaglebot/constants/bot";

// eaglebot derived types
import { CommandManager, type EagleBotCommandFileDefault } from "../core/index.ts";

export const id = "help";

export const commandVisualData:CommandVisualData = {
    "name": "help",
    "category": CategoryType.GENERAL
};

// function _getHelpChoices(commandManager:EagleBotCommandManager):ApplicationCommandOptionChoice[] {
//     const keys = commandManager.getCommandIds();
//     const choices:ApplicationCommandOptionChoice[] = [];
//     for(const key of keys) {
//         const commandVisualData = commandManager.getCommandVisualData(key);

//         if(!commandVisualData) {
//             continue;
//         }

//         choices.push({
//             name: commandVisualData.name,
//             value: key
//         });
//     }

//     return choices;
// }

export default {
    getCommandData() {
        return {
            name: "help",
            description: "도움말 출력하기",
            // 커맨드가 더 추가될 때 추가합니다.
            // options: [
            //     {
            //         name: "command",
            //         description: "자세히 알고자 하는 커맨드를 선택하세요.",
            //         type: ApplicationCommandOptionTypes.String,
            //         choices: _getHelpChoices(EagleBotCommandManager.get())
            //     }
            // ]
        };
    },
    async execute(_, interaction, botData) {
        const now = Date.now();

        await interaction.defer();

        const commandManager = CommandManager.get();

        const keys = commandManager.getCommandIds();
        const commandVisualDatas:CommandVisualData[] = [];

        for(const key of keys) {
            const commandVisualData = commandManager.getCommandVisualData(key);

            if(!commandVisualData) {
                continue;
            }

            commandVisualDatas.push(commandVisualData);
        }

        commandVisualDatas.sort((a, b) => {
            if(a.category === b.category) {
                return a.name.localeCompare(b.name);
            }
            return a.category.localeCompare(b.category);
        });

        const categoryTypes:CategoryType[] = [];
        const categorizedCommandVisualDatas = commandVisualDatas.reduce<Record<CategoryType, CommandVisualData[]>>((prevValue, currentValue) => {
            if(prevValue[currentValue.category] === undefined) {
                categoryTypes.push(currentValue.category);
                prevValue[currentValue.category] = [];
            }

            prevValue[currentValue.category].push(currentValue);

            return prevValue;
        }, {} as Record<CategoryType, CommandVisualData[]>);

        const embeds = createEmbeds().setTitle("도움말")
            .setThumbnail(avatarUrl(botData.me.id, botData.me.discriminator, {
                avatar: botData.me.avatar
            }))
            .setColor(botData.eaglebotColor)
            .setTimestamp(now);

        for(const categoryType of categoryTypes) {
            embeds.addField(
                categoryType,
                `\`/${categorizedCommandVisualDatas[categoryType].map((v) => v.name)
                    .join("`\n`/")
                }\``,
                true
            );
        }

        await interaction.respond({
            embeds
        });
    }
} satisfies EagleBotCommandFileDefault;