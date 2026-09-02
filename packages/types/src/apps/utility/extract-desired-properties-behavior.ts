import type { Bot } from "@discordeno/bot";

export type ExtractDesiredPropertiesBehavior<T> = T extends Bot<infer _, infer TPropsBehavior> ? TPropsBehavior : never;