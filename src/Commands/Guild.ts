import {ApplicationCommand, ChatInputCommandInteraction, EmbedBuilder} from "discord.js";
import {ApplicationCommandHandler} from "./InteractionHandler";

/** @ts-ignore */
export const GuildConfig: ApplicationCommand = {
    name: 'guild',
    description: 'Gets guild information',
}

export class GuildCommand extends ApplicationCommandHandler {
    commandName = GuildConfig.name;

    async handle(interaction: ChatInputCommandInteraction): Promise<void> {
        if (!interaction.guild) {
            await interaction.reply('This command must be run in a guild');
            return;
        }

        let embed = new EmbedBuilder()
            .setAuthor({
                name: interaction.guild.name
            })
            .setThumbnail(interaction.guild.iconURL() ?? '')
            .addFields([
                {
                    name: 'Member Count',
                    value: interaction.guild.memberCount.toString()
                },
                {
                    name: 'Channel Count',
                    value: interaction.guild.channels.cache.size.toString()
                },
                {
                    name: 'Emoji Count',
                    value: interaction.guild.emojis.cache.size.toString()
                }
            ])
            .setFooter({
                text: 'Created '
            })
            .setTimestamp(interaction.guild.createdTimestamp);

        if ((interaction.guild.description?.length ?? 0) > 0) {
            embed.setDescription(interaction.guild.description)
        }

        await interaction.reply({
            embeds: [embed]
        });
    }
}
