import type { DesiredPropertiesBehavior, SetupDesiredProps, TransformersDesiredProperties, User } from "@discordeno/bot";

export interface BotData<TProps extends TransformersDesiredProperties, TPropsBehavior extends DesiredPropertiesBehavior> {
    readonly upTimeStart:number;
    readonly me:SetupDesiredProps<User, TProps, TPropsBehavior>;
    readonly eaglebotColor:number;
}