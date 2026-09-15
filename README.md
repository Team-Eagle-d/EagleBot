# EagleBot
새롭게 다시 돌아온 독수리봇
------------------------------------------

Discord 서버에 다양한 기능을 제공하는 개인 개발 프로젝트입니다.

## Features
### Commands
| Command | Description |
|---|---|
| `/ping` | 봇의 응답 상태를 확인합니다. |
| `/help` | 사용 가능한 명령어를 확인합니다. |
| `/attcheck` | 출석을 체크합니다. |
| `/profile` | 사용자의 프로필을 확인합니다. |
| `/rank` | 서버 랭킹을 확인합니다. |

### Systems
#### XP & Level
사용자 활동에 따라 XP가 오르며, 일정량의 XP를 획득하면 레벨업합니다.
현재 XP를 올릴 수 있는 수단은 `/attcheck`가 유일합니다.

#### Economy
봇 내부에서 사용할 수 있는 재화입니다.
현재 돈을 얻을 수 있는 수단은 `/attcheck`가 유일합니다.

## Tech Stack
- 런타임: Deno 2
- 언어: TypeScript
- Discord: Discordeno
- Database: PostgreSQL
- ORM: Kysely

## Project Structure
- EagleBot/
    - apps/
        - bot/
    - packages/
        - constants/
        - database/
        - types/
        - utils/

## Development
### Requirements
- Deno 2
- PostgreSQL

### Setup
```Bash
git clone https://github.com/Team-Eagle-d/EagleBot.git
cd EagleBot
deno install
```

.env.example에 따라 환경변수를 설정한 후 데이터베이스 마이그레이션을 수행하세요.

```Bash
# 프로젝트 루트에서
deno task db:migrate-dev
# 또는 production 환경일 경우:
# deno task db:migrate
```

이후 봇을 실행하세요.

```Bash
# 프로젝트 루트에서
deno task start:dev
# 또는 production 환경일 경우:
# deno task --cwd apps/bot start
```

### Deno tasks
| Task | Defined In | Description |
|---|---|---|
| `start:dev` | `/deno.json` | development 환경에서 봇을 실행합니다. |
| `start:dev-watch` | `/deno.json` | development 환경에서 봇을 실행합니다. (watch 모드) |
| `db:make <fileTag>` | `/deno.json` | 마이그레이션 템플릿 코드를 [여기](./packages/database/migrations/)에 추가합니다. |
| `db:migrate` | `/deno.json` | 모든 적용되지 않은 마이그레이션 코드를 데이터베이스로 마이그레이션합니다. |
| `db:up` | `/deno.json` | 가장 이전 적용되지 않은 마이그레이션 코드를 데이터베이스로 마이그레이션합니다. |
| `db:rollback --all` | `/deno.json` | 데이터베이스의 모든 적용을 rollback합니다. |
| `db:down` | `/deno.json` | 데이터베이스의 가장 최근 적용을 취소합니다. |
| `db:migrate-dev` | `/deno.json` | 모든 적용되지 않은 마이그레이션 코드를 development 데이터베이스로 마이그레이션합니다. |
| `db:up-dev` | `/deno.json` | 가장 이전 적용되지 않은 마이그레이션 코드를 development 데이터베이스로 마이그레이션합니다. |
| `db:rollback-dev --all` | `/deno.json` | development 데이터베이스의 모든 적용을 rollback합니다. |
| `db:down-dev` | `/deno.json` | development 데이터베이스의 가장 최근 적용을 취소합니다. |
| `start` | `/apps/bot/deno.json` | production 환경에서 봇을 실행합니다. |

## Status
현재 **0.1.0** 개발이 완료되었습니다.

아직 개발이 진행 중인 프로젝트로, 프로젝트 구조는 이후 변경될 수 있습니다.

## License
License information will be added later.