import { REST, Routes } from "discord.js";
import { clientId, guildId, token } from "../config.json";
import { commands } from "../commands";

const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST({ version: "10" }).setToken(token);

export const deployCommands = async () => {
  try {
    console.log("Started refreshing application (/) commands.");
    console.log("commandsData", commandsData);
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
      body: commandsData,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
};

deployCommands();
