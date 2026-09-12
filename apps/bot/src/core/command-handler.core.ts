// @eaglebot/types
import type { BotData } from "@eaglebot/types/bot";

// eaglebot
import type { EagleBotProps, EagleBotPropsBehavior, EagleBotType } from "./eaglebot.core.ts";

// eaglebot derived types
import type { EagleBotCommandFileDefault, EagleBotInteraction } from "./type.core.ts";

// final class
// 싱글톤 디자인 패턴을 사용합니다.
export class CommandHandler {
    private static instance:CommandHandler;

    private constructor() {}

    public static get() {
        if(!this.instance) {
            this.instance = new CommandHandler();
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