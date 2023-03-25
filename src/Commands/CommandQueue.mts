import chalk, { ChalkInstance } from "chalk"
import { ApplicationCommand, Events, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes } from "discord.js"
import Env from "../Core/Env.mjs"
import Logger from "../Core/Logger.mjs"
import AbstractCommand from "./AbstractCommand.mjs"

export default class CommandQueue {
    private queue: Array<AbstractCommand> = []
    private commandsToRegister: Array<RESTPostAPIChatInputApplicationCommandsJSONBody> = []
    private listenerEnabled = false
    
    private static textColor(message: string)
    {
        return chalk.hex("#008080").overline(message)
    }

    private static log(message: string) {
        Logger.log(message, this.textColor("SLASH-COMMAND"))
    }

    private startListener() {
        if (this.listenerEnabled) {
            return
        }

        Env.client.once(Events.ClientReady, async (client) => {
            // @ts-ignore
            let commands: Array<ApplicationCommand> = await client.rest.get(
                Routes.applicationCommands(client.user.id) 
            )

            let getCommandByName = function (name: string): Promise<ApplicationCommand|null> {
                return new Promise((resolve, reject) => {
                    if (!commands.length) {
                        resolve(null)
                        return;
                    }
                    
                    commands.forEach((command, key) => {
                        if (command.name === name) {
                            resolve(command)
                        }

                        if (key === commands.length-1) {
                            resolve(null)
                        }
                    })
                })
            }

            await new Promise(resolve => {
                if (!this.queue.length) {
                    resolve([])
                    return
                }

                this.queue.forEach(async (queuedCommand, key) => {
                    let command = await getCommandByName(queuedCommand.getConfig().name)
                    let registerCommand = false

                    if (command === null || !queuedCommand.matchesApplicationCommand(command)) {
                        registerCommand = true
                    }

                    if (registerCommand) {
                        this.commandsToRegister.push(queuedCommand.getConfig().toJSON())
                    }
                    
                    CommandQueue.log(
                        registerCommand ?
                        `${CommandQueue.textColor(queuedCommand.getConfig().name)} needs registered` :
                        `${CommandQueue.textColor(queuedCommand.getConfig().name)} does not need registered`
                    )

                    if (key === this.queue.length-1) {
                        CommandQueue.log(`Registering ${CommandQueue.textColor(this.commandsToRegister.length.toString())} ${this.commandsToRegister.length !== 1 ? "commands" : "command"}`)
                        resolve(null)
                    }
                })
            })

            if (!this.commandsToRegister.length) {
                return;
            }
            
            this.commandsToRegister.forEach(command => {
                client.rest.post(
                    Routes.applicationCommands(client.application.id),
                    {
                        body: command
                    }
                ).then(() => {
                    CommandQueue.log(`Successfully registered ${command.name}`)
                }).catch(Logger.criticalCatchPromiseException())  
            })
        })
    }

    public addToQueue(command: AbstractCommand) {
        this.startListener()

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
    }

    public addToQueueArray(commands: Array<AbstractCommand>) {
        commands.forEach((command) => {
            this.addToQueue(command)
        })
    }
}