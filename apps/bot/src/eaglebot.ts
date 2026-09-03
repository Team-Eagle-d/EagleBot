// @eaglebot/types
import type { CommandFile, ExtractDesiredProperties, ExtractDesiredPropertiesBehavior, CommandBotData } from "@eaglebot/types/bot";

// Discordeno
import { createBot, Interaction, InteractionTypes, SetupDesiredProps } from "@discordeno/bot";

// @std
import { join, toFileUrl } from "@std/path";

function __getBot(handler:_EagleBotCommandHandler, getBotData:() => CommandBotData) {
    const bot = createBot({
        token: Deno.env.get("BOT_TOKEN")!,
        events: {
            ready: (payload, _) => {
                bot.logger.info(`[Log In]: Logged in as ${payload.user.username} (${payload.user.id})`);
            },
            interactionCreate: async (interaction) => {
                switch(interaction.type) {
                    case InteractionTypes.ApplicationCommand:
                        await handler.handleAppInteraction(bot, interaction, getBotData());
                        break;

                    default:
                        break;
                }
            }
        },
        desiredProperties: {
            user: {
                id: true,
                username: true,
                globalName: true
            },
            guild: {
                id: true
            },
            interaction: {
                id: true,
                data: true,
                type: true,
                token: true,
                channelId: true,
                guild: true
            },
            message: {
                id: true,
                components: true,
                author: true,
                channelId: true
            }
        }
    });

    return bot;
}

class _EagleBotCommandHandler {
    private readonly commandMap:EagleBotCommandMap;

    constructor(commandMap:EagleBotCommandMap) {
        this.commandMap = commandMap;
    }

    public async handleAppInteraction(bot:EagleBotType, interaction:EagleBotInteraction, botData:CommandBotData):Promise<void> {
        const command = this.commandMap.get(interaction.data?.name ?? "");
        if(!command) {
            bot.logger.error(`[Application Interaction Handler]: '${interaction.data?.name}' Slash Command는 존재하지 않습니다.`);
            return;
        }

        await command.execute(bot, interaction, botData);
    }
}

export class EagleBot {
    private static commandMap:Map<string, EagleBotCommandFile>;
    private static bot:EagleBotType;
    private static upTimeStart:number;
    private static handler:_EagleBotCommandHandler;

    public static async init() {
        if(!this.bot) {
            this.commandMap = new Map();
            this.handler = new _EagleBotCommandHandler(this.commandMap);
            this.bot = __getBot(this.handler, () => this.getBotData());
            this.upTimeStart = Date.now();
        }

        await this.setUpCommandMap();
        await this.upsertAppCommands();
    }

    public static async start() {
        await this.bot.start();
    }

    public static async setUpCommandMap():Promise<void> {
        const folderPath = join(import.meta.dirname ?? "", "./commands");
        for(const file of Deno.readDirSync(folderPath)) {
            const commandFile = (await import(toFileUrl(join(folderPath, file.name)).href)).default;

            if(!commandFile.id) {
                this.bot.logger.warn(`[Command Setup]: '${file.name}'에 'id' 필드가 존재하지 않습니다.`);
                continue;
            }

            if(!commandFile.getCommandData) {
                this.bot.logger.warn(`[Command Setup]: '${file.name}'에 'getCommandData' 메서드가 존재하지 않습니다.`);
                continue;
            }

            if(!commandFile.execute) {
                this.bot.logger.warn(`[Command Setup]: '${file.name}'에 'execute' 메서드가 존재하지 않습니다.`);
                continue;
            }

            this.commandMap.set(commandFile.id, commandFile);
            this.bot.logger.info(`[Command Setup]: ${commandFile.id} command map 등록 완료.`);
        }
    }

    public static async upsertAppCommands():Promise<void> {
        const commandDatas = this.commandMap.values()
            .toArray()
            .map((v) => {
                return v.getCommandData();
            }
        );

        await this.bot.helpers.upsertGuildApplicationCommands("1414284595918016647", commandDatas);

        this.bot.logger.info(`[Upsert Command]: Update/Insert 완료.`);
    }

    private static getBotData():CommandBotData {
        return {
            upTimeStart: this.upTimeStart
        };
    }
}

// bot types
type EagleBotType = ReturnType<typeof __getBot>;
type EagleBotCommandMap = Map<string, EagleBotCommandFile>;
type Props = ExtractDesiredProperties<EagleBotType>;
type PropsBehavior = ExtractDesiredPropertiesBehavior<EagleBotType>;

// inner types
export type EagleBotLogger = Extract<ReturnType<typeof __getBot>["logger"], object>;
export type EagleBotInteraction = SetupDesiredProps<Interaction, Props, PropsBehavior>;

// wrapper
export type EagleBotCommandFile = CommandFile<EagleBotType, EagleBotInteraction>;