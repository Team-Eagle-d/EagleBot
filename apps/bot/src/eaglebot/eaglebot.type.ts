// Discordeno
import type { Interaction, SetupDesiredProps, User } from "@discordeno/bot";

// @eaglebot/types
import type { CommandFileDefault } from "@eaglebot/types/bot"; 

// eaglebot
import type * as eaglebot from "./eaglebot.bot.ts";

// 분리했습니다.
// 타입을 eaglebot.ts에서 전부 잡는 것은 좀 그렇잖아요?

// Discordeno types
export type EagleBotLogger = Extract<eaglebot.EagleBotType["logger"], object>;
export type EagleBotInteraction = SetupDesiredProps<Interaction, eaglebot.EagleBotProps, eaglebot.EagleBotPropsBehavior>;
export type EagleBotUser = SetupDesiredProps<User, eaglebot.EagleBotProps, eaglebot.EagleBotPropsBehavior>;

// @eaglebot/types 
export type EagleBotCommandFileDefault = CommandFileDefault<eaglebot.EagleBotProps, eaglebot.EagleBotPropsBehavior>;