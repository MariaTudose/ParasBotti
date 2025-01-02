import { token } from "./config.json";
import { Client, Events, GatewayIntentBits } from "discord.js";
import { events } from "./events";
import remind from "./events/remind";

const guildId = "1216943520145866783";

export const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMembers],
});

client.login(token);

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);

  readyClient.guilds.fetch(guildId).then((guild) => {
    guild.members.fetch({ withPresences: true }).then((members) => {
      members.forEach((member) => {
        member.presence && remind.execute(null, member.presence);
      });
    });
  });
});

for (const event of events) {
  client.on(event.name, (...args: any) => {
    event.execute(...args);
  });
}
