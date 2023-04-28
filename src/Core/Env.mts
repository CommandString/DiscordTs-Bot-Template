import Logger from './Logger.mjs';
import { config } from 'dotenv';
import { Client } from 'discord.js';
import chalk from 'chalk';

export default class Env {
    public static TOKEN: string;
    public static LOGGER_PREFIX: string = chalk.bgRed('NOT SET');
    public static client: Client;
    private static initialized = false;

    public static init(): void {
        if (this.initialized) {
            Logger.warning('Env has already been initialized!');
            return;
        }

        this.initialized = true;

        Logger.info('Starting Bot');

        const res = config({
            path: '../.env',
        });

        if (res.error) {
            Logger.critical('Failed to load .env: ' + res.error);
        }
        else {
            // @ts-ignore
            const test = Object.entries(res.parsed);

            for (let i = 0; i < test.length; i++) {
                const item = test[i];
                const name = item[0];
                // @ts-ignore
                this[name] = item[1];
            }
        }
    }
}
