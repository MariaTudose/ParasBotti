import { token } from "./config.json";
import { Client, Events, GatewayIntentBits } from "discord.js";
import { events } from "./events";

export const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences],
});

client.login(token);

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

for (const event of events) {
  client.on(event.name, (...args: any) => {
    event.execute(...args);
  });
}
