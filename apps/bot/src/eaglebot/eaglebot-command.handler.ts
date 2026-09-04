// @eaglebot/types
import { BotData } from "@eaglebot/types/bot";

// eaglebot
import type { EagleBotProps, EagleBotPropsBehavior, EagleBotType } from "./eaglebot.bot.ts";

// eaglebot derived types
import type { EagleBotCommandFileDefault, EagleBotInteraction } from "./eaglebot.type.ts";

// final class
// 싱글톤 디자인 패턴을 사용합니다.
export class EagleBotCommandHandler {
    private static instance:EagleBotCommandHandler;

    private constructor() {}

    public static get() {
        if(!this.instance) {
            this.instance = new EagleBotCommandHandler();
        }

        return this.instance;
    }

    public async handleAppInteraction(
        command:EagleBotCommandFileDefault | undefined,
        bot:EagleBotType,
        interaction:EagleBotInteraction,
        botData:BotData<EagleBotProps, EagleBotPropsBehavior>
    ):Promise<void> {
        if(!command) {
            bot.logger.error(`[Application Interaction Handler]: '${interaction.data?.name}' Slash Command는 존재하지 않습니다.`);
            return;
        }

        await command.execute(bot, interaction, botData);
    }
}