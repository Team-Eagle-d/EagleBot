// Discordeno
import { createBot, InteractionTypes } from "@discordeno/bot";

// @eaglebot/types
import type { ExtractDesiredProperties, ExtractDesiredPropertiesBehavior, BotData } from "@eaglebot/types/bot";

// eaglebot
import { EagleBotCommandManager } from "./eaglebot-command.manager.ts";
import { EagleBotCommandHandler } from "./eaglebot-command.handler.ts";

// eaglebot derived types
import type { EagleBotUser } from "./eaglebot.type.ts";

function __getBot(commandManager:EagleBotCommandManager, commandHandler:EagleBotCommandHandler, getBotData:() => BotData<EagleBotProps, EagleBotPropsBehavior>) {
    const bot = createBot({
        token: Deno.env.get("BOT_TOKEN")!,
        events: {
            ready: (payload, _) => {
                bot.logger.info(`[Log In]: Logged in as ${payload.user.username} (${payload.user.id})`);
            },
            interactionCreate: async (interaction) => {
                switch(interaction.type) {
                    case InteractionTypes.ApplicationCommand:
                        await commandHandler.handleAppInteraction(
                            commandManager.getCommand(interaction.data?.name ?? ""),
                            bot,
                            interaction,
                            getBotData()
                        );
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
                globalName: true,
                avatar: true,
                discriminator: true
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

export class EagleBot {
    private static bot:EagleBotType;

    // bot-related
    private static _commandManager:EagleBotCommandManager;
    public static get commandManager() {
        return this._commandManager;
    }
    
    private static _commandHandler:EagleBotCommandHandler;
    public static get commandHandler() {
        return this._commandHandler;
    }

    // bot datas
    private static upTimeStart:number;
    private static me:EagleBotUser;

    // 봇 객체는 초기화 후 다시 초기화하는 과정이 생겼을 때 다시 생성하도록 하지 않습니다.
    // 어딜감히
    public static async init() {
        if(!this.bot) {
            // bot-related
            this._commandManager = EagleBotCommandManager.get();
            this._commandHandler = EagleBotCommandHandler.get();

            this.bot = __getBot(
                this.commandManager,
                this.commandHandler,
                () => this.getBotData()
            );

            // bot datas
            this.upTimeStart = Date.now();
            this.me = await this.bot.helpers.getUser(this.bot.id);
        }

        await this._commandManager.setUpCommandMap(this.bot.logger);
        await this._commandManager.upsertAppCommands(this.bot);
    }

    public static async start() {
        await this.bot.start();
    }

    // 봇 데이터 주입기
    private static getBotData():BotData<EagleBotProps, EagleBotPropsBehavior> {
        return {
            upTimeStart: this.upTimeStart,
            me: this.me,
            eaglebotColor: 0xB97A56
        };
    }
}

// bot types
export type EagleBotType = ReturnType<typeof __getBot>;
export type EagleBotProps = ExtractDesiredProperties<EagleBotType>;
export type EagleBotPropsBehavior = ExtractDesiredPropertiesBehavior<EagleBotType>;