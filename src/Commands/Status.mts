import { SlashCommandBuilder, CommandInteraction, EmbedBuilder, MessageFlags } from "discord.js"
import { memoryUsage } from "process"
import Env from "../Core/Env.mjs"
import AbstractCommand from "./AbstractCommand.mjs"

export default class extends AbstractCommand {
    protected config = new SlashCommandBuilder()
        .setName("status")
        .setDescription("Get status of the bot")
    

    public handle(CommandInteraction: CommandInteraction): void
    {
        let mem = memoryUsage()

        CommandInteraction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: Env.client.user?.tag!
                    })
                    .setThumbnail(Env.client.user?.avatarURL()!)
                    .addFields(
                        {
                            name: "Memory Usage",
                            value: `${Math.round((mem.heapUsed / 1e+4)) / 1e+2} MB`
                        },
                        {
                            name: "Guild Count",
                            value: `${Env.client.guilds.cache.size}`
                        }
                    )
                    .setFooter({
                        text: `Started`
                    })
                    .setTimestamp(Env.client.readyTimestamp)
            ],
            flags: MessageFlags.Ephemeral
        })
    }
}