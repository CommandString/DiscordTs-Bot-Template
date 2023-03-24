import { SlashCommandBuilder, CommandInteraction } from "discord.js";

export default abstract class AbstractCommand {
    public abstract config: SlashCommandBuilder
    public abstract handle(CommandInteraction: CommandInteraction): void
}