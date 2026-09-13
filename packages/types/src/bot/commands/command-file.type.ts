import type { DesiredPropertiesBehavior, TransformersDesiredProperties } from "@discordeno/bot";
import type { CommandVisualData } from "../data/command-visual.data.ts";
import type { CommandFileDefault } from "./command-file-default.type.ts";

// 동적 import용
export interface CommandFile<TProps extends TransformersDesiredProperties, TPropsBehavior extends DesiredPropertiesBehavior> {
    /**
     * 커맨드의 id를 지정합니다.
     * commandMap에서 key로 사용됩니다.
     */
    readonly id:string;
    /**
     * 실제로 보여지는 커맨드의 데이터를 명시합니다.
     */
    readonly commandVisualData:CommandVisualData;
    /**
     * 실제로 저장되는 부분입니다.
     * export default로 내보내세요.
     */
    readonly default:CommandFileDefault<TProps, TPropsBehavior>;
}

