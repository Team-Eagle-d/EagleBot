# DB 구조 명세서

## 1. 개요
- DBMS: PostgreSQL
- ORM: Drizzle

## 2. 비즈니스 룰
- 서버는 여러 사용자를 보유합니다.
- 사용자는 경험치, 레벨, 돈을 보유합니다.
- 사용자는 서버 별로 출석 기록을 보유합니다.
- 사용자는 하루마다 출석 가능합니다.

## 3. 모델 및 관계
- Server
    - id(PK): INT
    - discordServerId: BIGINT

- ServerUser
    - discordServerId(PK, FK): BIGINT
    - discordUserId(PK, FK): BIGINT
    - level: INT
    - xp: BIGINT
    - money: BIGINT

- User
    - id(PK): INT
    - discordUserId: BIGINT

- Attendance
    - discordServerId(PK, FK): BIGINT
    - discordUserId(PK, FK): BIGINT
    - attendanceDate(PK): DATE
    - checkedAt: TIMESTAMP

Server와 User는 M:N의 관계를 지닙니다.
User와 Attendance는 1:N의 관계를 지닙니다.
Server와 Attendance는 1:N의 관계를 지닙니다.