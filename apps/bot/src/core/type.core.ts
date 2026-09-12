// Discordeno
import type { Interaction, Member, SetupDesiredProps, User } from "@discordeno/bot";

// @eaglebot/types
import type { CommandFileDefault } from "@eaglebot/types/bot"; 

// eaglebot
import type * as eaglebot from "./eaglebot.core.ts";

// 분리했습니다.
// 타입을 eaglebot.core.ts에서 전부 잡는 것은 좀 그렇잖아요?

// Discordeno types
export type EagleBotLogger = Extract<eaglebot.EagleBotType["logger"], object>;
export type EagleBotInteraction = SetupDesiredProps<Interaction, eaglebot.EagleBotProps, eaglebot.EagleBotPropsBehavior>;
export type EagleBotUser = SetupDesiredProps<User, eaglebot.EagleBotProps, eaglebot.EagleBotPropsBehavior>;
export type EagleBotMember = SetupDesiredProps<Member, eaglebot.EagleBotProps, eaglebot.EagleBotPropsBehavior>;

// @eaglebot/types 
export type EagleBotCommandFileDefault = CommandFileDefault<eaglebot.EagleBotProps, eaglebot.EagleBotPropsBehavior>;