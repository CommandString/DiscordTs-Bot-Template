import {Client, GatewayIntentBits} from 'discord.js';
import dotenv from "dotenv";
import EventHandler from "./Events/EventHandler";
import InteractionCreate from "./Events/InteractionCreate";
import Ready from "./Events/Ready";
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

dotenv.config({
    'path': './.env'
});

const eventHandlers: EventHandler[] = [
    new InteractionCreate,
    new Ready
]

for (let handler of eventHandlers) {
    client.on(handler.event, handler.handle.bind(handler));
}

client.login(process.env.TOKEN!).catch(() => {
    console.error('Failed to login');
    process.exit(1);
});

export default client;
