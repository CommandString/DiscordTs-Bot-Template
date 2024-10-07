import EventHandler, {ClientEventName} from "./EventHandler";
import {Interaction} from "discord.js";
import {InteractionHandler} from "../Commands/InteractionHandler";
import PingCommand from "../Commands/Ping";
import {GuildCommand} from "../Commands/Guild";

export default class InteractionCreate extends EventHandler {
    readonly event: ClientEventName = 'interactionCreate';
    private static handlers: InteractionHandler[] = [
        new PingCommand,
        new GuildCommand
    ];

    async handle(interaction: Interaction): Promise<void> {
        for (let handler in InteractionCreate.handlers) {
            if (InteractionCreate.handlers[handler].shouldHandle(interaction)) {
                await InteractionCreate.handlers[handler].handle(interaction);
            }
        }
    }
}