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

export type Reminder = {
  userId: string;
  type: number;
  interval: number;
};

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const type = interaction.options.getNumber("tyyppi") ?? 0;
  const interval = interaction.options.getNumber("interval") ?? 1;
  const user = interaction.user;

  await interaction.reply({
    content: `Saat jatkossa muistutuksen ${type === 0 ? "jumpata" : "juoda vettä"} ${interval} tunnin välein`,
    ephemeral: true,
  });

  fs.readFile("./data/reminders.json", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }
    const reminderItem = { userId: user.id, type, interval };
    const parsedData = JSON.parse(data) as Reminder[];
    const existing = parsedData.find((item) => item.userId === user.id && item.type === type);
    if (existing) {
      parsedData[parsedData.indexOf(existing)] = reminderItem;
    } else parsedData.push(reminderItem);

    fs.writeFile("./data/reminders.json", JSON.stringify(parsedData), (err) => {
      const typeString = type === 0 ? "exercise" : "drinking water";
      if (err) {
        console.error(err);
        return;
      } else {
        console.log(`${user.globalName} will get reminders for ${typeString} every ${interval} hours`);
      }
    });
  });
};
