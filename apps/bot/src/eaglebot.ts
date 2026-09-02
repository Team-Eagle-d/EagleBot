// @eaglebot/types
import type { CommandFile, ExtractDesiredProperties, ExtractDesiredPropertiesBehavior } from "@eaglebot/types/apps";

// Discordeno
import { createBot, Interaction, InteractionTypes, SetupDesiredProps } from "@discordeno/bot";

// @std
import { join, toFileUrl } from "@std/path";

export class EagleBot {
    private static readonly commandMap:Map<string, EagleBotCommandFile> = new Map();
    private static __bot:ReturnType<typeof this.__getBot>;
    public static get bot():typeof this.__bot {
        if(!this.__bot) {
            throw "봇이 초기화되지 않았습니다.";
        }

        return this.__bot;
    }


    public static async init() {
        if(!this.__bot) {
            this.__bot = this.__getBot();
        }

        await this.setUpCommandMap();
        await this.upsertAppCommands();
    }

    public static async start() {
        await this.__bot.start();
    }

    private static __getBot() {
        const bot = createBot({
            token: Deno.env.get("BOT_TOKEN")!,
            events: {
                ready: (payload, _) => {
                    bot.logger.info(`[Log In]: Logged in as ${payload.user.username} (${payload.user.id})`);
                },
                interactionCreate: async (interaction) => {
                    switch(interaction.type) {
                        case InteractionTypes.ApplicationCommand:
                            await this.__handleAppInteraction(interaction);
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
                interaction: {
                    id: true,
                    data: true,
                    type: true,
                    token: true,
                    channelId: true
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

    public static async setUpCommandMap():Promise<void> {
        const folderPath = join(import.meta.dirname ?? "", "./commands");
        for(const file of Deno.readDirSync(folderPath)) {
            const commandFile = (await import(toFileUrl(join(folderPath, file.name)).href)).default;

            if(!commandFile.id) {
                this.__bot.logger.warn(`[Command Setup]: '${file.name}'에 'id' 필드가 존재하지 않습니다.`);
                continue;
            }

            if(!commandFile.getCommandData) {
                this.__bot.logger.warn(`[Command Setup]: '${file.name}'에 'getCommandData' 메서드가 존재하지 않습니다.`);
                continue;
            }

            if(!commandFile.execute) {
                this.__bot.logger.warn(`[Command Setup]: '${file.name}'에 'execute' 메서드가 존재하지 않습니다.`);
                continue;
            }

            this.commandMap.set(commandFile.id, commandFile);
            this.__bot.logger.info(`[Command Setup]: ${commandFile.id} command map 등록 완료.`);
        }
    }

    public static async upsertAppCommands():Promise<void> {
        const commandDatas = this.commandMap.values()
            .toArray()
            .map((v) => {
                return v.getCommandData();
            }
        );

        await this.__bot.helpers.upsertGuildApplicationCommands("1414284595918016647", commandDatas);

        this.__bot.logger.info(`[Upsert Command]: Update/Insert 완료.`);
    }

    private static async __handleAppInteraction(interaction:EagleBotInteraction):Promise<void> {
        const command = this.commandMap.get(interaction.data?.name ?? "");
        if(!command) {
            this.__bot.logger.error(`[Application Interaction Handler]: '${interaction.data?.name}' Slash Command는 존재하지 않습니다.`);
            return;
        }

        await command.execute(this.__bot, interaction);
    }
}

// bot types
type EagleBotType = typeof EagleBot.bot;
type Props = ExtractDesiredProperties<EagleBotType>;
type PropsBehavior = ExtractDesiredPropertiesBehavior<EagleBotType>;

// inner types
export type EagleBotLogger = Extract<typeof EagleBot.bot.logger, object>;
export type EagleBotInteraction = SetupDesiredProps<Interaction, Props, PropsBehavior>;

// wrapper
export type EagleBotCommandFile = CommandFile<EagleBotType, EagleBotInteraction>;