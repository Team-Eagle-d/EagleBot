import type { ExtractPgColumnBaseConfig } from "./extract-pg-column-base-config.util.ts";

export type GetPgColumnDataType<TColumnBaseConfig extends ExtractPgColumnBaseConfig<any>> = TColumnBaseConfig["data"];