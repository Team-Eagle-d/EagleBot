// 언어 관련 기능 개발 전까지 enum 값은 한국어로 고정합니다.
// export const CategoryType = {
//     GENERAL: "general",
//     // 필드가 1개밖에 없으면 if로 같은지 검사하고 나머지 로직 작성할 때 never로 추론하더라구요.
//     // 임시로 추가했습니다.
//     GAME: "game"
//     // ...
// } as const satisfies Record<string, string>;

export const CategoryType = {
    GENERAL: "일반",
    GAME: "게임"
} as const satisfies Record<string, string>;

export type CategoryType = (typeof CategoryType)[keyof typeof CategoryType];