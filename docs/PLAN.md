# 프로젝트 계획서

## 1. 프로젝트 개요
- 프로젝트명: 독수리봇(EagleBot)
- 프로젝트 목적: 기존 프로젝트 계승

### 1-1. 스택 상세
- 언어: TypeScript
- 런타임: Deno 2
- Discord Bot 라이브러리: Discordeno
- ORM: Drizzle

## 2. 워크스페이스 구조
- eaglebot/
    - apps/
        - bot/ 독수리봇 코드 컨텐츠는 이 폴더에 들어갑니다.
    - packages/
        - types/ apps/ 프로젝트에 사용되는 공통/개별 타입 정의
    - docs/ 여러 문서를 모아둡니다. 개인 프로젝트로 설계되었기 때문에 대부분의 문서는 공개합니다.
    - deno.json
    - README.md
    - 등

확장 가능성을 고려하며 하나의 공통 브랜드로 잡기 위해 Mono Repository 구조로 설계하였습니다.

## 3. 기능 상세
apps/bot에 대한 기능 상세는 [BOT_DOCUMENT.md](./BOT_DOCUMENT.md)를 참고하시길 바랍니다.

## 4. 마일스톤
프로젝트 전체 구조에 대한 흐름만 간략히 명시합니다.
1. 환경 설정
2. apps/bot 구조 설정
3. apps/bot 1차 기능 개발
4. 테스트
5. 배포