import type { Bot, CreateSlashApplicationCommand, DesiredPropertiesBehavior, Interaction, SetupDesiredProps, TransformersDesiredProperties } from "@discordeno/bot";
import type { BotData } from "../data/bot.data.ts";

export interface CommandFileDefault<TProps extends TransformersDesiredProperties, TPropsBehavior extends DesiredPropertiesBehavior> {
    /**
     * 슬래시 커맨드 생성 요청에 들어갈 커맨드 데이터입니다.
     * {@link CreateSlashApplicationCommand}
     */
    getCommandData():CreateSlashApplicationCommand;
    /**
     * 명령어에 대한 실행 함수입니다.
     */
    execute(
        bot:Bot<TProps, TPropsBehavior>,
        interaction:SetupDesiredProps<Interaction, TProps, TPropsBehavior>,
        botData:BotData<TProps, TPropsBehavior>
    ):Promise<void>;
}