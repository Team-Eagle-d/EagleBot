import type { CreateSlashApplicationCommand } from "@discordeno/bot";
import type { CommandBotData } from "./command-bot-data.ts";

// 동적 import용
export interface CommandFile<TBot, TInteraction> {
    readonly id:string;
    getCommandData():CreateSlashApplicationCommand;
    execute(bot:TBot, interaction:TInteraction, botData:CommandBotData):Promise<void>;
}