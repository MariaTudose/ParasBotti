import fs from "node:fs";
import { Reminder } from "../commands/muistuta";

export const readLocalFile = (path: string) => {
  try {
    const data = fs.readFileSync(path, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error(err);
    return [];
  }
};
