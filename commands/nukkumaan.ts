import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { firstMsgs, secondMsgs } from "../utils/messages";

export const data = new SlashCommandBuilder()
  .setName("nukkumaan")
  .setDescription("Peittelee ja antaa hyvän yön suukon")
  .addNumberOption((option) => option.setName("milloin").setDescription("Monen minuutin päästä haluat nukkumaan"))
  .addNumberOption((option) => option.setName("kesto").setDescription("Monta tuntia haluat nukkua"));

export async function execute(interaction: ChatInputCommandInteraction) {
  const delay = interaction.options.getNumber("milloin") ?? 60;
  const duration = interaction.options.getNumber("kesto") ?? 1;

  const user = interaction.user;
  const userName = user.toString();
  let memberInstance: GuildMember;

  if (interaction && interaction.guild) {
    memberInstance = await interaction.guild.members.fetch(interaction.user.id);
  }
  await interaction.reply({
    content: `${interaction.user} menee kiltisti nukkumaan ${delay} minuutin päästä`,
  });

  const random = Math.floor(Math.random() * firstMsgs.length);
  if (delay > 15) {
    setTimeout(async () => {
      const content = firstMsgs[random].replace("user", userName);
      console.log("15min sleep reminder", content);
      try {
        await interaction.followUp({ content, ephemeral: true });
      } catch (e) {
        console.error(e);
      }
    }, (delay - 15) * 60 * 1000);
  }

  if (delay > 2) {
    setTimeout(async () => {
      const content = secondMsgs[random].replace("user", userName);
      console.log("2min sleep reminder", content);
      try {
        await interaction.followUp({
          content,
          ephemeral: true,
        });
      } catch (e) {
        console.error(e);
      }
    }, (delay - 2) * 60 * 1000);
  }

  setTimeout(async () => {
    console.log("kick");
    try {
      await memberInstance.timeout(duration * 60 * 60 * 1000);
      await interaction.followUp({
        content: `Hyvää yötä ${userName}`,
        ephemeral: true,
      });
    } catch (e) {
      console.error(e);
    }
  }, delay * 60 * 1000);
}
