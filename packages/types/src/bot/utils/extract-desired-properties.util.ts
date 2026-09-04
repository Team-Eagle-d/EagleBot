import type { Bot } from "@discordeno/bot";

export type ExtractDesiredProperties<T> = T extends Bot<infer TProps, infer _> ? TProps : never;