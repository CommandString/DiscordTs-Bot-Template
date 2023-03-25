import Env from "./Core/Env.mjs"
import chalk from 'chalk'
import { Client, GatewayIntentBits as Intents } from 'discord.js'
import ClientReady from "./Events/ClientReady.mjs"
import CommandQueue from "./Commands/CommandQueue.mjs"
import Status from "./Commands/Status.mjs"
import { getDefaultIntents } from "./Core/Helpers.mjs"

Env.LOGGER_PREFIX = chalk.blue("TS-BOT")
Env.init()

Env.client = new Client({
    intents: getDefaultIntents()
})

// EVENTS
ClientReady.listen()

new CommandQueue().addToQueueArray([
    new Status
]).checkQueue()

Env.client.login(Env.TOKEN)