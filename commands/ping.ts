import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder().setName("ping").setDescription("Replies with Pong!");

export const execute = (interaction: CommandInteraction) => interaction.reply("Pong!");
