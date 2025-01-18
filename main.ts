import { CronJob } from "cron";
import { Client, Events, GatewayIntentBits, TextChannel } from "discord.js";
import { events } from "./events";
import remind from "./events/remind";
import { themeMessages } from "./messages";
import dotenv from "dotenv";
dotenv.config();

const guildId = "1216943520145866783";
const generalId = "1216944969051410525";
const weekDays = [0, 1, 2, 3, 4, 5, 6];

export const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMembers],
});

client.login(process.env.TOKEN);

client.once(Events.ClientReady, (readyClient) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);

  // Set up reminders on startup
  readyClient.guilds.fetch(process.env.GUILD_ID || "").then((guild) => {
    guild.members.fetch({ withPresences: true }).then((members) => {
      members.forEach((member) => {
        member.presence && remind.execute(null, member.presence);
      });
    });
  });

  weekDays.forEach((weekDay) => {
    new CronJob(`0 0 8 * * ${weekDay}`, () => {
      const channel = readyClient.channels.cache.get(generalId) as TextChannel;
      channel.send(themeMessages[weekDay][Math.floor(Math.random() * 4)]);
    }).start();
  });
});

for (const event of events) {
  client.on(event.name, (...args: any) => {
    event.execute(...args);
  });
}
