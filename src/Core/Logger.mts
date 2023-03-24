import chalk from "chalk";
import { exit } from "process";
import Env from "./Env.mjs";

export default class Logger {
    public static readonly ERROR_TYPE = chalk.redBright("ERROR")
    public static readonly INFO_TYPE = chalk.blue("INFO")
    public static readonly CRITICAL_TYPE = chalk.redBright("CRITICAL")
    public static readonly DEBUG_TYPE = chalk.green("DEBUG")
    public static readonly WARNING_TYPE = chalk.yellow("WARNING")

    public static breakLine() {
        console.log("");
    }

    public static info(message: string) {
        return this.log(message, this.INFO_TYPE)
    }

    public static debug(message: string) {
        return this.log(message, this.DEBUG_TYPE);
    }

    public static error(message: string) {
        return this.log(chalk.bgRed(message), this.ERROR_TYPE)
    }

    public static critical(message: string): never
    {
        this.log(chalk.bgRed(message), this.CRITICAL_TYPE)
        exit(1)
    }

    public static warning(message: string) {
        return this.log(message, this.WARNING_TYPE)
    }

    public static dumpArray(array: Array<any>) {
        return this.debug(array.join(", "));
    }

    public static log(message: string, type: string = "DEFAULT") {
        console.log(`[${Env.LOGGER_PREFIX}] [${type}]: ${message}`)
        return this
    }
}