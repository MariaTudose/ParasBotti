import { User } from "discord.js";

export const clearPastMessages = (user: User) => {
  try {
    user.createDM().then((dmChannel) => {
      dmChannel.messages.fetch().then((msg) =>
        msg.forEach((message) => {
          if (message.author.id === user.client.user.id) {
            message.delete();
          }
        })
      );
    });
  } catch (error) {
    console.error(error);
  }
};
