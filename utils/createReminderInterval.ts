import { User } from "discord.js";
import { Reminder } from "../commands/muistuta";

const hourToMs = 60 * 60 * 1000;

export const createReminderInterval = (user: User, reminder: Reminder, messages: string[]) =>
  setInterval(() => {
    console.log(user.globalName + " received reminder");
    const random = Math.floor(Math.random() * messages.length);
    user.send(messages[random]).then((msg) => {
      // Delete previous reminder when next one comes
      setTimeout(() => msg.delete(), reminder.interval * hourToMs);
    });
  }, reminder.interval * hourToMs);
