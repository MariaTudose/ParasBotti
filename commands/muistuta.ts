import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import fs from "node:fs";

export const data = new SlashCommandBuilder()
  .setName("muistuta")
  .setDescription("Muistuttaa juomaan vettä ja jumppaamaan!")
  .addNumberOption((option) =>
    option
      .setName("tyyppi")
      .setDescription("Mistä haluat muistutuksen")
      .addChoices([
        { name: "jumppa", value: 0 },
        { name: "vesi", value: 1 },
      ])
      .setRequired(true)
  )
  .addNumberOption((option) =>
    option.setName("interval").setDescription("Monen tunnin välein? (desimaalit ok)").setRequired(true)
  );

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const type = interaction.options.getNumber("tyyppi") ?? 0;
  const interval = interaction.options.getNumber("interval") ?? 1;
  const user = interaction.user;
  const userName = user.toString();

  await interaction.reply({
    content: `Saat jatkossa muistutuksen ${type === 0 ? "jumpata" : "juoda vettä"} ${interval} tunnin välein`,
    ephemeral: true,
  });

  fs.readFile("./data/reminders.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const parsedData = JSON.parse(data);
    parsedData.push({ userId: user.id, type, interval });

    fs.writeFile("./data/reminders.json", JSON.stringify(parsedData), (err) => {
      if (err) {
        console.error(err);
        return;
      } else {
        console.log(`${userName} will get reminders`);
      }
    });
  });
};
