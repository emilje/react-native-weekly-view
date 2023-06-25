import { DateTime } from "luxon";
import { View } from "react-native";
import { calendarEvent } from "./types";

export const getStartingDates = () => {
  const weekStart = DateTime.now().startOf("week");
  const weekEnd = DateTime.now().endOf("week");

  return { start: weekStart, end: weekEnd };
};

export const shiftWeek = (currentWeekStart: DateTime, direction: number) => {
  let newWeekStart = currentWeekStart.plus({ week: direction });

  if (newWeekStart.weekday !== 1) {
    newWeekStart = newWeekStart.startOf("week");
  }

  const weekEnd = newWeekStart.endOf("week");
  return { start: newWeekStart, end: weekEnd };
};

export const getDatesByWeek = (
  currentWeekStart: DateTime,
  weekNumber: number
) => {
  let newWeekStart = currentWeekStart.set({ weekNumber });

  if (newWeekStart.get("weekday") !== 1) {
    newWeekStart = newWeekStart.startOf("week");
  }

  const weekEnd = newWeekStart.endOf("week");
  return { start: newWeekStart, end: weekEnd };
};

export const getIntersectingGroups = (events: calendarEvent[]) => {
  let currentGroup = 0;
  const groups: { [key: number]: any[number | string] } = { 0: [] };

  events = events.sort((a, b) => {
    const startA = DateTime.fromISO(a.isoStart);
    const startB = DateTime.fromISO(b.isoStart);
    return startA >= startB ? 1 : -1;
  });

  for (let i = 0; i < events.length; i++) {
    const event = events[i];
    const nextEvent = events[i + 1];
    const eventStart = DateTime.fromISO(event.isoStart);
    const eventEnd = DateTime.fromISO(event.isoEnd);

    if (!nextEvent) {
      groups[currentGroup].push(event.id);
      break;
    }

    const nextStart = DateTime.fromISO(nextEvent.isoStart);

    if (nextStart >= eventEnd) {
      groups[currentGroup].push(event.id);
      currentGroup++;
      groups[currentGroup] = [];
      continue;
    }

    if (nextStart >= eventStart && nextStart <= eventEnd) {
      groups[currentGroup].push(event.id);
      groups[currentGroup].push(nextEvent.id);
    }
  }

  const filteredGroups: { [key: number]: any[number | string] } = {};
  let totalEventsSorted = 0;

  for (const [key, value] of Object.entries(groups)) {
    const uniqueValuesArr = Array.from(new Set(value));
    filteredGroups[Number(key)] = uniqueValuesArr;
    totalEventsSorted += uniqueValuesArr.length;
  }

  if (events.length !== totalEventsSorted) {
    console.warn("Smth is up.");
  }

  return filteredGroups;
};

export const measureView = async (
  viewRef: React.RefObject<View>
): Promise<{
  x: number;
  y: number;
  width: number;
  height: number;
  pageX: number;
  pageY: number;
}> => {
  return new Promise((res) =>
    viewRef.current?.measure((x, y, width, height, pageX, pageY) => {
      res({ x, y, width, height, pageX, pageY });
    })
  );
};
