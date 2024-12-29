import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import { firstMsgs, secondMsgs } from "../utils/messages";

export const data = new SlashCommandBuilder()
  .setName("nukkumaan")
  .setDescription("Peittelee ja antaa hyvän yön suukon")
  .addStringOption((option) =>
    option.setName("kellonaika").setDescription("Mihin aikaan haluat nukkumaan? Anna muodossa 22:00").setRequired(true)
  )
  .addNumberOption((option) => option.setName("kesto").setDescription("Monta tuntia haluat nukkua").setRequired(true));

export const execute = async (interaction: ChatInputCommandInteraction) => {
  const duration = interaction.options.getNumber("kesto") ?? 1;
  const time = interaction.options.getString("kellonaika");
  const user = interaction.user;
  const userName = user.toString();

  if (!time || !/^([01]\d|2[0-3]):?([0-5]\d)$/.test(time)) {
    await interaction.reply({
      content: `Kellonaika puuttuu tai on väärässä muodossa. Oikea muoto on 22:00`,
      ephemeral: true,
    });
    return;
  }

  if (!interaction || !interaction.guild) {
    await interaction.reply({
      content: `Käyttäjää ei löytynyt`,
      ephemeral: true,
    });
    return;
  }

  const memberInstance = await interaction.guild.members.fetch(interaction.user.id);

  await interaction.reply({
    content: `${interaction.user} menee kiltisti nukkumaan klo ${time}`,
  });

  const date = new Date();
  const minutesNow = date.getHours() * 60 + date.getMinutes();
  const [hours, minutes] = time.split(":");

  const minutesThen = Number(hours) * 60 + Number(minutes);
  const minutesDiff = minutesThen - minutesNow;

  let timeout = 1;

  if (minutesDiff > 0) {
    console.log("kellonaika on jälkeen nykyhetkeä");
    timeout = minutesDiff;
  } else if (minutesDiff < 0) {
    console.log("kellonaika on ennen nykyhetkeä");
    timeout = 24 * 60 + minutesDiff;
  }

  const random = Math.floor(Math.random() * firstMsgs.length);

  if (timeout > 15) {
    setTimeout(async () => {
      const content = firstMsgs[random].replace("user", userName);
      console.log("15min sleep reminder", content);
      user.send(content);
    }, (timeout - 15) * 60 * 1000);
  }

  if (timeout > 2) {
    setTimeout(async () => {
      const content = secondMsgs[random].replace("user", userName);
      console.log("2min sleep reminder", content);
      user.send(content);
    }, (timeout - 2) * 60 * 1000);
  }

  setTimeout(async () => {
    console.log("kick user", userName, "at: ", new Date());
    try {
      await user.send(`Hyvää yötä ${userName}`);
      await memberInstance.timeout(duration * 60 * 60 * 1000);
    } catch (e) {
      console.error(e);
    }
  }, timeout * 60 * 1000);
};
