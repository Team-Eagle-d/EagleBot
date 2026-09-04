// @eaglebot/types
import { CommandVisualData } from "@eaglebot/types/bot";

// eaglebot derived types
import type { EagleBotCommandFileDefault, EagleBotLogger } from "./eaglebot.type.ts";
import { EagleBotType } from "./eaglebot.bot.ts";

// @std
import { join, toFileUrl } from "@std/path";

// final class
// 싱글톤 디자인 패턴을 사용합니다.
export class EagleBotCommandManager {
    private static instance:EagleBotCommandManager;
    
    // 나중에 초기화됩니다.
    private commandMap!:Map<string, EagleBotCommandFileDefault>;
    private commandVisualDataMap!:Map<string, CommandVisualData>;

    private constructor() {}

    public static get():EagleBotCommandManager {
        if(!this.instance) {
            this.instance = new EagleBotCommandManager();
            this.instance.commandMap = new Map();
            this.instance.commandVisualDataMap = new Map();
        }

        return this.instance;
    }

    public async setUpCommandMap(logger?:EagleBotLogger):Promise<void> {
        const folderPath = join(import.meta.dirname ?? "", "../commands");
        for(const file of Deno.readDirSync(folderPath)) {
            const commandFile = (await import(toFileUrl(join(folderPath, file.name)).href));

            if(!commandFile.id
            || typeof commandFile.id !== "string") {
                logger?.warn(`[Command Setup]: '${file.name}'의 'id' 내보내기가 정상적이지 않습니다.`);
                continue;
            }

            if(!this._validateCommand(commandFile.default, logger, file.name)) {
                continue;
            }

            if(!this._validateCommandVisualData(commandFile.commandVisualData, logger, file.name)) {
                continue;
            }

            this.commandMap.set(commandFile.id, commandFile.default);
            this.commandVisualDataMap.set(commandFile.id, commandFile.commandVisualData);
            logger?.info(`[Command Setup]: ${commandFile.id} command map 등록 완료.`);
        }
    }

    // true: 검증 통과
    // false: 검증 탈락
    private _validateCommand(command:unknown, logger?:EagleBotLogger, fileName?:string):command is EagleBotCommandFileDefault {
        if(!command
        || typeof command !== "object") {
            logger?.warn(`[Command Setup]: '${fileName ?? "알 수 없는 파일"}'의 'export default'로 내보내진 객체가 존재하지 않습니다.`);
            return false;
        }

        if(!("getCommandData" in command)
        || typeof command.getCommandData !== "function") {
            logger?.warn(`[Command Setup]: '${fileName ?? "알 수 없는 파일"}'의 'export default'로 내보내진 객체에 'getCommandData' 메서드가 정상적이지 않습니다.`);
            return false;
        }

        if(!("execute" in command)
        || typeof command.execute !== "function") {
            logger?.warn(`[Command Setup]: '${fileName ?? "알 수 없는 파일"}'의 'export default'로 내보내진 객체에 'execute' 메서드가 정상적이지 않습니다.`);
            return false;
        }

        return true;
    }

    // true: 검증 통과
    // false: 검증 탈락
    private _validateCommandVisualData(commandVisualData:unknown, logger?:EagleBotLogger, fileName?:string):commandVisualData is CommandVisualData {
        if(!commandVisualData
        || typeof commandVisualData !== "object") {
            logger?.warn(`[Command Setup(Visual Data)]: '${fileName ?? "알 수 없는 파일"}'에 'commandVisualData' 내보내기가 존재하지 않습니다.`);
            return false;
        }

        if(!("name" in commandVisualData)
        || typeof commandVisualData.name !== "string") {
            logger?.warn(`[Command Setup(Visual Data)]: '${fileName ?? "알 수 없는 파일"}'의 'commandVisualData' 내보내기에 'name' 필드가 존재하지 않습니다.`);
            return false;
        }

        if(!("category" in commandVisualData)
        || typeof commandVisualData.category !== "string") {
            logger?.warn(`[Command Setup(Visual Data)]: '${fileName ?? "알 수 없는 파일"}'의 'commandVisualData' 내보내기에 'category' 필드가 존재하지 않습니다.`);
            return false;
        }

        return true;
    }

    public async upsertAppCommands(bot:Omit<EagleBotType, "logger">, logger?:EagleBotLogger):Promise<void> {
        const commandDatas = this.commandMap.values()
            .toArray()
            .map((v) => {
                return v.getCommandData();
            }
        );

        await bot.helpers.upsertGuildApplicationCommands("1414284595918016647", commandDatas);

        logger?.info(`[Upsert Command]: Update/Insert 완료.`);
    }

    public getCommand(commandId:string) {
        return this.commandMap.get(commandId);
    }

    public getCommandVisualData(commandId:string) {
        return this.commandVisualDataMap.get(commandId);
    }

    public getCommandIds():string[] {
        return this.commandMap.keys().toArray();
    }
}