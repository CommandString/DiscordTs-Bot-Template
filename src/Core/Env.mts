import Logger from "./Logger.mjs"
import { config } from "dotenv"
import { Client } from 'discord.js'
import chalk from "chalk"

export default class Env {
    public static TOKEN: string
    private static initialized = false
    public static LOGGER_PREFIX: string = chalk.bgRed("NOT SET")
    public static client: Client

    public static init(): void
    {
        if (this.initialized) {
            Logger.warning("Env has already been initialized!")
            return
        }

        this.initialized = true

        Logger.info("Starting Bot")

        let res = config({
            path: "../.env"
        })

        if (res.error) {
            Logger.critical("Failed to load .env: " + res.error)
        } else {
            // @ts-ignore
            let test = Object.entries(res.parsed)

            for (let i = 0; i < test.length; i++) {
                let item = test[i]
                let name = item[0]
                let value = item[1]

                // @ts-ignore
                this[name] = value
            }
        }
    }
}
