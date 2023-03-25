import { SlashCommandBuilder, CommandInteraction, Events, ApplicationCommand, ApplicationCommandOptionType, SlashCommandAttachmentOption } from "discord.js"
import Env from "../Core/Env.mjs"
import Logger from "../Core/Logger.mjs"

export default class AbstractCommand {
    protected config: SlashCommandBuilder = new SlashCommandBuilder()

    public handle(CommandInteraction: CommandInteraction): any
    {
        Logger.critical(`You must override AbstractCommand.handle!`)
    }

    public listen() {
        Env.client.on(Events.InteractionCreate, (interaction) => {
            if (!interaction.isChatInputCommand() || interaction.commandName !== this.config.name) {
                return
            }

            this.handle(interaction)
        })
    }

    public getConfig() {
        return this.config
    }

    public matchesApplicationCommand(command: ApplicationCommand): boolean {
        let thisJson = this.getConfig().toJSON()

        for (let value in thisJson) {
            // @ts-ignore
            if (thisJson[value] !== command[value] && typeof thisJson[value] !== "undefined" && thisJson[value].length !== 0) {
                return false
            }
        }

        return true;
    }
}
