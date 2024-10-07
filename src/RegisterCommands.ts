import {PingConfig} from "./Commands/Ping";
import { REST, Routes } from 'discord.js';
import dotenv from "dotenv";
import {GuildConfig} from "./Commands/Guild";

dotenv.config({
    'path': './.env'
});

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN!);

(async () => {
    const commands = [PingConfig, GuildConfig];

    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(Routes.applicationCommands(process.env.ID!), { body: commands });

        console.log('Successfully reloaded application (/) commands.');
        console.log('Commands registered:', commands.map(command => command.name).join(', '))
    } catch (error) {
        console.error(error);
    }
})();
