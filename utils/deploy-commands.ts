import { REST, Routes } from "discord.js";
import fs from "node:fs";
import { fileURLToPath } from "url";
import path, { dirname } from "node:path";
import { clientId, guildId, token } from "../config.json";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const commands = [];
// Grab all the command folders from the commands directory you created earlier
const commandsPath = path.join(__dirname, "/../commands");

const commandFiles = fs
  .readdirSync(commandsPath)
  .filter((file) => file.endsWith(".js"));
// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  if ("data" in command && "execute" in command) {
    commands.push(command.data.toJSON());
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
    );
  }
}

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );

    if (Array.isArray(data)) {
      console.log(
        `Successfully reloaded ${data.length} application (/) commands.`
      );
    }
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
