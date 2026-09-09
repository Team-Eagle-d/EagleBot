import type { PgColumn } from "drizzle-orm/pg-core";

export type ExtractPgColumnBaseConfig<TPgColumn extends PgColumn> = TPgColumn extends PgColumn<infer TColumnBaseConfig, infer _, infer __> ? TColumnBaseConfig : never;