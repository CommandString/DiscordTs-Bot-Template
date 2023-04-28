import chalk from 'chalk';
import { ApplicationCommand, Events, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from 'discord.js';
import Env from '../Core/Env.mjs';
import Logger from '../Core/Logger.mjs';
import AbstractCommand from './AbstractCommand.mjs';

export default class CommandQueue {
    private queue: Array<AbstractCommand> = [];
    private intervalCreated = false;

    private static textColor(message: string) {
        return chalk.hex('#008080').overline(message);
    }

    private static log(message: string) {
        Logger.log(message, this.textColor('SLASH-COMMAND'));
    }

    public async checkQueue() {
        if (!Env.client.isReady()) {
            if (!this.intervalCreated) {
                const interval = setInterval(() => {
                    if (Env.client.isReady()) {
                        clearInterval(interval);
                    }
                    else {
                        return;
                    }

                    this.checkQueue();
                }, 1000);

                this.intervalCreated = true;
            }

            return;
        }

        const client = Env.client;

        if (!client || !client.user || !client.application) return;

        // @ts-ignore
        const registeredCommands: Array<ApplicationCommand> = await client.rest.get(
            Routes.applicationCommands(client.user.id),
        );

        const getCommandByName = function(name: string): ApplicationCommand | null {
            for (let i = 0; i < registeredCommands.length; i++) {
                const registeredCommand = registeredCommands[i];

                if (registeredCommand.name === name) {
                    return registeredCommand;
                }
            }

            return null;
        };

        const queue = this.queue;
        const commandsToRegister: Array<RESTPostAPIChatInputApplicationCommandsJSONBody> = [];

        for (let i = 0; i < queue.length; i++) {
            const queuedCommand = queue.pop();

            if (typeof queuedCommand === 'undefined') {
                break;
            }

            let registerCommand = false;
            const registeredCommand = getCommandByName(queuedCommand.getConfig().name);

            if (registeredCommand === null || !queuedCommand.matchesApplicationCommand(registeredCommand)) {
                CommandQueue.log(`${CommandQueue.textColor(queuedCommand.getConfig().name)} needs registered`);
                registerCommand = true;
            }

            if (registerCommand) {
                commandsToRegister.push(queuedCommand.getConfig().toJSON());
            }
        }

        for (let i = 0; i < commandsToRegister.length; i++) {
            const commandToRegister = commandsToRegister.pop();

            if (typeof commandToRegister === 'undefined') {
                break;
            }

            client.rest.post(
                Routes.applicationCommands(client.application.id),
                {
                    body: commandToRegister,
                },
            ).then(() => {
                CommandQueue.log(`${CommandQueue.textColor(commandToRegister?.name!)} was registered successfully!`);
            }).catch(Logger.errorCatchPromiseException());
        }

        return this;
    }

    public addToQueue(command: AbstractCommand) {
        CommandQueue.log(`Added ${CommandQueue.textColor(command.getConfig().name)} to command queue`);

        this.queue.push(command);

        Env.client.on(Events.InteractionCreate, (interaction) => {
            if (
                !interaction.isChatInputCommand() ||
                interaction.commandName !== command.getConfig().name
            ) {
                return;
            }

            try {
                command.handle(interaction);
            }
            catch (e) {
                Logger.error(`Failed to execute ${command.getConfig().name}: ${e}`);
            }
        });

        return this;
    }

    public addToQueueArray(commands: Array<AbstractCommand>) {
        for (const command in commands) {
            this.addToQueue(commands[command]);
        }

        return this;
    }
}
