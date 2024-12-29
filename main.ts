import { token } from "./config.json";
import { ChatInputCommandInteraction, Client, Events, GatewayIntentBits } from "discord.js";
import { commands } from "./commands";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (readyClient: any) => {
  console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

client.login(token);

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  if (interaction instanceof ChatInputCommandInteraction && commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction);
  }
});
