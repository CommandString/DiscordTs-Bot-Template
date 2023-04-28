import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import AbstractCommand from './AbstractCommand.mjs';

export default class extends AbstractCommand {
    protected config = new SlashCommandBuilder()
        .setName('example')
        .setDescription('Example Command');


    public handle(CommandInteraction: CommandInteraction) {
        void CommandInteraction.reply({ content: 'Hello World!', flags: 64 /* ephemeral flag */ });
    }
}
