import { CommandInteraction, EmbedBuilder, MessageFlags, SlashCommandBuilder } from 'discord.js';
import { memoryUsage } from 'process';
import Env from '../Core/Env.mjs';
import AbstractCommand from './AbstractCommand.mjs';

export default class extends AbstractCommand {
    protected config = new SlashCommandBuilder()
        .setName('status')
        .setDescription('Check bot status');


    public handle(CommandInteraction: CommandInteraction): void {
        const mem = memoryUsage();

        void CommandInteraction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({
                        name: Env.client.user?.tag!,
                    })
                    .setThumbnail(Env.client.user?.avatarURL()!)
                    .addFields(
                        {
                            name: 'Memory Usage',
                            value: `${Math.round((mem.heapUsed / 1e+4)) / 1e+2} MB`,
                        },
                        {
                            name: 'Guild Count',
                            value: `${Env.client.guilds.cache.size}`,
                        },
                        {
                            name: 'Uptime',
                            value: `<t:${Math.round((Env.client.readyAt?.getTime()! - (new Date().getTime() - Env.client.readyAt?.getTime()!)) / 1000)}:R>`,
                        },
                    ),
            ],
            flags: MessageFlags.Ephemeral,
        });
    }
}
