import { Events, ChatInputCommandInteraction } from "discord.js";
import { commands } from "../commands";
import { client } from "../main";

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  if (interaction instanceof ChatInputCommandInteraction && commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction);
  }
});
