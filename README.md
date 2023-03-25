# DiscordTs-Bot-Template

A DiscordJS bot template written in TS based on my [DiscordPHP Bot Template](https://github.com/commandstring/discordphp-bot-template)

# Important Resources

[DiscordJS Guide](https://discordjs.guide)

[DiscordJS Docs](https://discord.js.org/#/)

[DiscordJS Server](https://discord.gg/djs)

[Developer Hub](https://discord.gg/TgrcSkuDtQ) *If you any questions with the template*

[Typescript](https://www.typescriptlang.org/)

# Environment Configuration

1. copy `.env.example` to `.env`
2. open `.env` and replace `CHANGE_ME` with your discord token

## Retrieving Environment Variables

```ts
import Env from "./Core/Env.mjs"

Env.ENV_VAR_NAME_HERE
```

## Adding Additional Environment Variables

First, you have to add typings for it

```ts
// src/Core/Env.mts

export default class Env {
    public static TOKEN: string
    public static NEW_VAR: string
```

Second, add `NEW_VAR` to `.env` *(you should also add it to .env.example)*

```ini
# ./env

TOKEN=CHANGE_ME
NEW_VAR=CHANGE_ME
```

## Adding Additional Environment Variables at Runtime

Add typings like in [Adding Additional Environment Variables](#adding-additional-environment-variables)

Define the property..

```ts
Env.NEW_VAR = "some-cool-value"
```

# Events

## Creating Event Listeners

1. Copy `src/Events/Example.mts` to `src/Events/NameOfEvent.mts`
2. Replace `Events.ClientReady` with the type of event you want to listen for
3. *If you want this handler to run once then set `once` to `true`*
4. Replace code inside the `handle` method

After following those steps you should have something that looks like this...

```ts
// src/Events/ClientReady.mts

import chalk from "chalk"
import { Client, Events } from "discord.js"
import Logger from "../Core/Logger.mjs"
import AbstractEvent from "./AbstractEvent.mjs"

export default class ClientReady extends AbstractEvent {
    public static eventName = Events.ClientReady
    public static once = true

    public static handle(client: Client|null = null) {
        Logger.info(`Logged in as ${chalk.blue(client?.user?.tag)}!`)
    }
}

```

## Listening For Events

Invoke the `listen` method on the event (preferably on `index.mts`)

```ts
// index.mts

ClientReady.listen()
```
