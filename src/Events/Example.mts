import { Events } from 'discord.js';
import AbstractEvent from './AbstractEvent.mjs';

export default class Example extends AbstractEvent {
    public static eventName = Events.ClientReady;
    public static once = false;

    public static handle() {
        AbstractEvent.handle();
    }
}
