import { Events, Presence } from "discord.js";
import { Reminder } from "../commands/muistuta";
import { waterReminderMessages, exerciseReminderMessages } from "../messages";
import { readLocalFile } from "../utils/readLocalFile";
import { createReminderInterval } from "../utils/createReminderInterval";
import { EventHandler } from "../types";
import { clearPastMessages } from "../utils/clearPastMessages";

type Intervals = {
  waterInterval: NodeJS.Timeout | null;
  exerciseInterval: NodeJS.Timeout | null;
};

const offlineStatus = ["offline", "idle"];
const userIntervals = new Map<string, Intervals>();
const reminderData: Reminder[] = readLocalFile("./data/reminders.json");

const clearIntervals = (userId: string) => {
  if (userIntervals.has(userId)) {
    const { waterInterval, exerciseInterval } = userIntervals.get(userId)!;
    waterInterval && clearInterval(waterInterval);
    exerciseInterval && clearInterval(exerciseInterval);
  }
};

const name = Events.PresenceUpdate;

const execute = (oldMember: Presence | null, newMember: Presence) => {
  const { status: oldStatus } = oldMember || { status: "offline" };
  const { userId, user, status: newStatus } = newMember;
  if (!user) return;

  const date = new Date().toLocaleString("en-GB");
  console.log(`${date} - ${user.displayName} went ${newStatus}`);

  const userReminders = reminderData.filter((reminder) => reminder.userId === userId);

  if (userReminders.length > 0 && offlineStatus.includes(oldStatus) && newStatus === "online") {
    console.log("userReminders", userReminders);

    clearIntervals(userId);

    const exercise = userReminders.find((reminder) => reminder.type === 0);
    const water = userReminders.find((reminder) => reminder.type === 1);
    const intervals: Intervals = { waterInterval: null, exerciseInterval: null };

    if (exercise) intervals.exerciseInterval = createReminderInterval(user, exercise, exerciseReminderMessages);
    if (water) intervals.waterInterval = createReminderInterval(user, water, waterReminderMessages);

    userIntervals.set(userId, intervals);
  } else if (userReminders.length > 0 && offlineStatus.includes(newStatus)) {
    clearIntervals(userId);
  }
};

export default { name, execute } as EventHandler<Events.PresenceUpdate>;
