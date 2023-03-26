import chalk, { ChalkInstance } from "chalk"
import { ApplicationCommand, Client, Events, REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from "discord.js"
import Env from "../Core/Env.mjs"
import Logger from "../Core/Logger.mjs"
import AbstractCommand from "./AbstractCommand.mjs"

export default class CommandQueue {
    private queue: Array<AbstractCommand> = []
    private intervalCreated = false

    private static textColor(message: string)
    {
        return chalk.hex("#008080").overline(message)
    }

    private static log(message: string) {
        Logger.log(message, this.textColor("SLASH-COMMAND"))
    }

    public async checkQueue() {
        if (!Env.client.isReady()) {
            if (!this.intervalCreated) {
                let interval = setInterval(() => {
                    if (Env.client.isReady()) {
                        CommandQueue.log("Bot is ready clearing interval")
                        clearInterval(interval)
                    } else {
                        CommandQueue.log("Bot is not ready, will retry to check the queue in 1 second");
                        return;
                    }

                    this.checkQueue()
                }, 1000);

                this.intervalCreated = true
            }

            CommandQueue.log("Bot is not ready, will retry to check the queue in 1 second");

            return
        }

        let client = Env.client

        // @ts-ignore
        let registeredCommands: Array<ApplicationCommand> = await client.rest.get(
            Routes.applicationCommands(client.user.id) 
        )

        let getCommandByName = function (name: string): ApplicationCommand|null {
            for (let i = 0; i < registeredCommands.length; i++) {
                let registeredCommand = registeredCommands[i]

                if (registeredCommand.name === name) {
                    return registeredCommand
                }
            }

            return null
        }

        let queue = this.queue
        let commandsToRegister: Array<RESTPostAPIChatInputApplicationCommandsJSONBody> = []

        for (let i = 0; i < queue.length; i++) {
            let queuedCommand = queue.pop()

            if (typeof queuedCommand === "undefined") {
                break;
            }

            let registerCommand = false
            let registeredCommand = getCommandByName(queuedCommand.getConfig().name)

            if (registeredCommand === null || !queuedCommand.matchesApplicationCommand(registeredCommand)) {
                CommandQueue.log(`${queuedCommand.getConfig().name} needs registered`)
                registerCommand = true
            } else {
                CommandQueue.log(`${queuedCommand.getConfig().name} does not need registered`)
            }

            if (registerCommand) {
                commandsToRegister.push(queuedCommand.getConfig().toJSON())
            }
        }

        for (let i = 0; i < commandsToRegister.length; i++) {
            let commandToRegister = commandsToRegister.pop()
            
            if (typeof commandToRegister === "undefined") {
                break;
            }

            client.rest.post(
                Routes.applicationCommands(client.application.id),
                {
                    body: commandToRegister
                }
            ).then(() => {
                CommandQueue.log(`${commandToRegister?.name} was registered successfully!`)
            }).catch(Logger.errorCatchPromiseException())
        }

        return this
    }

    public addToQueue(command: AbstractCommand) {
        CommandQueue.log(`Added ${CommandQueue.textColor(command.getConfig().name)} to command queue`)

        this.queue.push(command)

        Env.client.on(Events.InteractionCreate, (interaction) => {
            if (
                !interaction.isChatInputCommand() || 
                interaction.commandName !== command.getConfig().name
            ) {
                return
            }

            try {
                command.handle(interaction)
            } catch (e) {
                Logger.error(`Failed to execute ${command.getConfig().name}: ${e}`)
            }
        })

        return this
    }

    public addToQueueArray(commands: Array<AbstractCommand>) {
        for (let command in commands) {
            this.addToQueue(commands[command])
        }

        return this
    }
}