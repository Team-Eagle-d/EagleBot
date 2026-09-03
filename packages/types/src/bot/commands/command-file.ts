import type { Bot, CreateSlashApplicationCommand, DesiredPropertiesBehavior, Interaction, SetupDesiredProps, TransformersDesiredProperties } from "@discordeno/bot";
import type { CommandBotData } from "./command-bot-data.ts";

// 동적 import용
export interface CommandFile<TProps extends TransformersDesiredProperties, TPropsBehavior extends DesiredPropertiesBehavior> {
    readonly id:string;
    getCommandData():CreateSlashApplicationCommand;
    execute(
        bot:Bot<TProps, TPropsBehavior>,
        interaction:SetupDesiredProps<Interaction, TProps, TPropsBehavior>,
        botData:CommandBotData<TProps, TPropsBehavior>
    ):Promise<void>;
}