import chalk from 'chalk';
import { ApplicationCommand, GatewayIntentBits as Intents, Routes } from 'discord.js';
import Env from './Env.mjs';
import Logger from './Logger.mjs';

export function getDefaultIntents(): number {
    let defaultIntents = 0;
    const privilegedIntents = Intents.MessageContent | Intents.GuildPresences | Intents.GuildMembers;

    for (const bit in Intents) {
        // @ts-ignore
        defaultIntents |= bit;
    }

    return defaultIntents & ~privilegedIntents;
}

export async function deleteSlashCommandByName(name: string) {
    if (!Env.client.isReady()) {
        setTimeout(() => deleteSlashCommandByName(name), 1000);
        return;
    }

    // @ts-ignore
    const commands: Array<ApplicationCommand> = await Env.client.rest.get(Routes.applicationCommands(Env.client.application.id));

    for (const i in commands) {
        const command = commands[i];

        if (command.name === name) {
            if (!Env.client.application) return;

            await Env.client.rest.delete(
                Routes.applicationCommand(
                    Env.client.application.id,
                    command.id,
                ),
            );

            Logger.debug(`Deleted command ${chalk.red(name)}`);
            return;
        }
    }

    Logger.debug(`Was unable to find a registered command under the name ${chalk.red(name)}`);
}
