import { ClientEvents } from "discord.js";

export type EventHandler<Event extends keyof ClientEvents> = {
  name: Event;
  execute: (...args: ClientEvents[Event]) => void;
};
