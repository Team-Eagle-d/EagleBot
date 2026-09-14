import type { Generated } from "kysely";

export interface Database {
    readonly server:ServerTable;
    readonly user:UserTable;
    readonly serverUser:ServerUserTable;
    readonly attendance:AttendanceTable;
}

export interface ServerTable {
    readonly id:Generated<number>;
    readonly discordServerId:bigint;
}

export interface UserTable {
    readonly id:Generated<number>;
    readonly discordUserId:bigint;
}

export interface ServerUserTable {
    readonly discordServerId:bigint;
    readonly discordUserId:bigint;

    readonly level:Generated<number>;
    readonly xp:Generated<bigint>;

    readonly money:Generated<bigint>;

    readonly createdAt:Generated<Date>;
    readonly updatedAt:Generated<Date>;

    readonly attendanceStreak:Generated<number>;
}

export interface AttendanceTable {
    readonly discordServerId:bigint;
    readonly discordUserId:bigint;

    /**
     * JS에서는 Date로 해석됩니다.
     * (YYYY-MM-DDT00:00:00.000Z)
     */
    readonly attendanceDate:string;
    readonly checkedAt:Date;
}