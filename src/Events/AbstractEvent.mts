import chalk from "chalk";
import Env from "../Core/Env.mjs";
import Logger from "../Core/Logger.mjs";

export default abstract class AbstractEvent {
    protected static eventName: string
    protected static once: boolean = false;
    private static listening: boolean = false;

    public static handle(): any
    {
        Logger.critical(`You must override AbstractEvent.handle!`)
    }

    public static listen() {
        if (this.listening) {
            Logger.warning(`${this.name} is already being listened for`)
            return
        }

        this.listening = true

        Logger.log(`Listening for event ${chalk.hex("#8800FF").overline(this.name)}`, chalk.hex("#8800FF").overline("EVENT"))

        if (this.once) {
            Env.client.once(this.eventName, this.handle)
        } else {
            Env.client.on(this.eventName, this.handle)
        }
    }
}
