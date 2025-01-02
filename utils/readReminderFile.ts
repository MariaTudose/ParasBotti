import fs from "node:fs";
import { Reminder } from "../commands/muistuta";

export const readReminderFile = () => {
  try {
    const data = fs.readFileSync("./data/reminders.json", "utf8");
    return JSON.parse(data) as Reminder[];
  } catch (err) {
    console.error(err);
    return [];
  }
};
