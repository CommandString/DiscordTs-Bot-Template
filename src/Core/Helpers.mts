import { GatewayIntentBits as Intents } from "discord.js";

export function getDefaultIntents(): number
{
    let defaultIntents = 0;
    let privilegedIntents = Intents.MessageContent | Intents.GuildPresences | Intents.GuildMembers

    for (let bit in Intents) {
        if (
            typeof bit !== "string"
        ) {
            continue;
        }

        // @ts-ignore
        defaultIntents |= bit
    }

    return defaultIntents & ~privilegedIntents;
}