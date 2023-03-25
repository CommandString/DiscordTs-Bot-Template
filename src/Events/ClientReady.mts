import chalk from "chalk"
import { ApplicationCommand, Client, Events, Routes, TextBasedChannel } from "discord.js"
import Logger from "../Core/Logger.mjs"
import AbstractEvent from "./AbstractEvent.mjs"

export default class ClientReady extends AbstractEvent {
    public static eventName = Events.ClientReady
    public static once = true

    public static handle(client: Client|null = null) {
        Logger.info(`Logged in as ${chalk.blue(client?.user?.tag)}!`)
    }
}
