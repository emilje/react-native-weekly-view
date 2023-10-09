import { DateTime } from "luxon";
import { View } from "react-native";
import { CalendarEvent } from "./types";

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

export const filterAndSortEvents = (
  events: CalendarEvent[],
  dates: { start: DateTime; end: DateTime }
) => {
  const filteredEvents = events.filter((event) => {
    const startDate = DateTime.fromISO(event.isoStart);

    return startDate >= dates.start && startDate <= dates.start.endOf("week");
  });

  filteredEvents.sort((a, b) => {
    const startA = DateTime.fromISO(a.isoStart);
    const startB = DateTime.fromISO(b.isoStart);
    return startA >= startB ? 1 : -1;
  });

  return filteredEvents;
};

const isIntersectingCurrentGroup = (
  event: CalendarEvent,
  currentGroup: number[] | string[],
  events: CalendarEvent[]
) => {
  const eventStart = DateTime.fromISO(event.isoStart);
  for (const groupEventId of currentGroup) {
    const groupEvent = events.find((event) => event.id === groupEventId);
    const groupEventEnd = DateTime.fromISO(groupEvent!!.isoEnd);

    if (eventStart < groupEventEnd) {
      return true;
    }
  }

  return false;
};

export const getIntersectingGroups = (events: CalendarEvent[]) => {
  let currentGroup = 0;
  let sortedEvents = 0;
  const groups: { [key: number]: any[number | string] } = { 0: [] };

  for (let i = 0; i < events.length; i++) {
    const event = events[i];

    if (groups[currentGroup].length === 0) {
      groups[currentGroup].push(event.id);
      sortedEvents++
      continue;
    }

    if (isIntersectingCurrentGroup(event, groups[currentGroup], events)) {
      groups[currentGroup].push(event.id);
    } else {
      currentGroup++;
      groups[currentGroup] = [event.id];
    }

    sortedEvents++
  }

  if(sortedEvents !== events.length) {
    console.warn("Some events did not get grouped.")
  }
  return groups;
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
