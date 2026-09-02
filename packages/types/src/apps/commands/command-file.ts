import type { CreateSlashApplicationCommand } from "@discordeno/bot";

// 동적 import용
export interface CommandFile<TBot, TInteraction> {
    readonly id:string,
    getCommandData():CreateSlashApplicationCommand;
    execute(bot:TBot, interaction:TInteraction):Promise<void>;
}