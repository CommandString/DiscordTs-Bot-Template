import Env from "./Core/Env.mjs"
import chalk from 'chalk'
import Ping from "./Commands/Ping.mjs"
import { Client, GatewayIntentBits as Intents, Events } from 'discord.js'
import Logger from "./Core/Logger.mjs"

Env.LOGGER_PREFIX = chalk.red("NOT READY")
Env.init()

Env.client = new Client({
    intents: Intents.Guilds,
})

Env.client.once(Events.ClientReady, (c) => {
    Env.LOGGER_PREFIX = c.user.username.toUpperCase()
    Logger.info(`Logged in as ${c.user.tag}!`)

    Env.client.channels.cache.get("1070684220021801000")?.send("test")
})

Env.client.login(Env.TOKEN)