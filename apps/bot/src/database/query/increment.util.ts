import { PgColumn } from "drizzle-orm/pg-core";
import { type ColumnBaseConfig, sql } from "drizzle-orm";
import { type GetPgColumnDataType } from "@eaglebot/types/shared";

/**
 * 매개변수를 다음과 같이 묶어 반환합니다.
 * 
 * ```TypeScript
 * sql`${column} + ${value}`
 * ```
 */
export function increment<TColumnBaseConfig extends ColumnBaseConfig<any, any>>(column:PgColumn<TColumnBaseConfig>, value:GetPgColumnDataType<TColumnBaseConfig>) {
    return sql`${column} + ${value}`;
}