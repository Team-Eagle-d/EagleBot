import { sql, type Kysely } from "kysely";

export async function up(client:Kysely<unknown>) {
    await client.schema.createTable("server")
        .addColumn("id", "serial", (column) => {
            return column.primaryKey();
        })
        .addColumn("discord_server_id", "bigint", (column) => {
            return column.unique()
                .notNull();
        })
        .execute();

    await client.schema.createTable("user")
        .addColumn("id", "serial", (column) => {
            return column.primaryKey();
        })
        .addColumn("discord_user_id", "bigint", (column) => {
            return column.unique()
                .notNull();
        })
        .execute();

    await client.schema.createTable("server_user")
        .addColumn("discord_server_id", "bigint", (column) => {
            return column.notNull()
                .references("server.discord_server_id");
        })
        .addColumn("discord_user_id", "bigint", (column) => {
            return column.notNull()
                .references("user.discord_user_id");
        })
        .addColumn("level", "integer", (column) => {
            return column.notNull()
                .defaultTo(0);
        })
        .addColumn("xp", "bigint", (column) => {
            return column.notNull()
                .defaultTo(0);
        })
        .addColumn("money", "bigint", (column) => {
            return column.notNull()
                .defaultTo(0);
        })
        .addColumn("created_at", "timestamp", (column) => {
            return column.notNull()
                .defaultTo(sql`CURRENT_TIMESTAMP`);
        })
        .addColumn("updated_at", "timestamp", (column) => {
            return column.notNull()
                .defaultTo(sql`CURRENT_TIMESTAMP`);
        })
        .addColumn("attendance_streak", "integer", (column) => {
            return column.notNull()
                .defaultTo(1);
        })
        .addPrimaryKeyConstraint("server_user_pk", [
            "discord_server_id",
            "discord_user_id"
        ])
        .execute();

    await client.schema.createTable("attendance")
        .addColumn("discord_server_id", "bigint", (column) => {
            return column.notNull()
                .references("server.discord_server_id");
        })
        .addColumn("discord_user_id", "bigint", (column) => {
            return column.notNull()
                .references("user.discord_user_id");
        })
        .addColumn("attendance_date", "date", (column) => {
            return column.notNull();
        })
        .addColumn("checked_at", "timestamp", (column) => {
            return column.notNull();
        })
        .addPrimaryKeyConstraint("attendance_pk", [
            "discord_server_id",
            "discord_user_id",
            "attendance_date"
        ])
        .execute();

    await sql`
        CREATE FUNCTION update_updated_at()
        RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
        $$ LANGUAGE plpgsql;
    `.execute(client);

    await sql`
        CREATE TRIGGER server_user_updated_at
        BEFORE UPDATE ON server_user
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at();
    `.execute(client);
}

export async function down(client:Kysely<unknown>) {
    await sql`
        DROP TRIGGER IF EXISTS server_user_updated_at
        ON server_user;
    `.execute(client);

    await sql`
        DROP FUNCTION IF EXISTS update_updated_at;
    `.execute(client);

    await client.schema.dropTable("attendance")
        .execute();

    await client.schema.dropTable("server_user")
        .execute();

    await client.schema.dropTable("user")
        .execute();

    await client.schema.dropTable("server")
        .execute();
}