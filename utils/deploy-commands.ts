import { REST, Routes } from "discord.js";
import { commands } from "../commands";
import dotenv from "dotenv";
dotenv.config();

const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN || "");

export const deployCommands = async () => {
  try {
    console.log("Started refreshing application (/) commands.");
    console.log("commandsData", commandsData);
    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID || "", process.env.GUILD_ID || ""), {
      body: commandsData,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
};

deployCommands();
