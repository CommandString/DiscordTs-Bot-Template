import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from "discord.js";
import AbstractCommand from "./AbstractCommand.mjs";

export default class extends AbstractCommand {
    public handle(CommandInteraction: CommandInteraction): void
    {
        CommandInteraction.reply("Pong :ping_pong:");
    }

    public config = new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Ping the bot")
    ;
}