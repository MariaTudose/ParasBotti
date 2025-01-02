import { Events, ChatInputCommandInteraction, CacheType, Interaction, ClientEvents } from "discord.js";
import { commands } from "../commands";
import { EventHandler } from "../types";

const name = Events.InteractionCreate;

const execute = (interaction: Interaction<CacheType>) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  if (interaction instanceof ChatInputCommandInteraction && commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction);
  }
};

export default { name, execute } as EventHandler<Events.InteractionCreate>;
