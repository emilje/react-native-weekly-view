import { DateTime, Interval } from "luxon";
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
  groupEvents: CalendarEvent[]
) => {
  const eventStart = DateTime.fromISO(event.isoStart);
  for (const groupEvent of groupEvents) {
    const groupEventEnd = DateTime.fromISO(groupEvent.isoEnd);

    if (eventStart < groupEventEnd) {
      return true;
    }
  }

  return false;
};

export const getIntersectingGroups = (events: CalendarEvent[]) => {
  let currentGroup = 0;
  let sortedEvents = 0;
  const groups: { [key: number]: CalendarEvent[] } = { 0: [] };

  for (let i = 0; i < events.length; i++) {
    const event = events[i];

    if (groups[currentGroup].length === 0) {
      groups[currentGroup].push(event);
      sortedEvents++
      continue;
    }

    if (isIntersectingCurrentGroup(event, groups[currentGroup])) {
      groups[currentGroup].push(event);
    } else {
      currentGroup++;
      groups[currentGroup] = [event];
    }

    sortedEvents++
  }

  if(sortedEvents !== events.length) {
    console.warn("Some events did not get grouped.")
  }

  return groups;
};

const areEventsIntersecting = (
  event1: CalendarEvent,
  event2: CalendarEvent
) => {
  const event1Interval = Interval.fromDateTimes(
    DateTime.fromISO(event1.isoStart),
    DateTime.fromISO(event1.isoEnd)
  );

  const event2Interval = Interval.fromDateTimes(
    DateTime.fromISO(event2.isoStart),
    DateTime.fromISO(event2.isoEnd)
  );

  const intersection = event2Interval.intersection(event1Interval);

  return intersection ? true : false;
};

export const getColumnData = (groupEvents: CalendarEvent[]) => {
  let columns: CalendarEvent[][] = [];
  let sortedEvents = 0;
  const idToColumn: { [key: number | string]: number } = {};

  for (const event of groupEvents) {
    for (let i = 0; i < groupEvents.length; i++) {
      // If column has no events, put event in that column and proceed to next event.
      if (!columns[i]) {
        columns[i] = [event];
        idToColumn[event.id] = i;
        sortedEvents++;
        break;
      }

      // Check if event is overlapping another event in the current column.
      let isIntersectingColumnEvent = false;
      for (const columnEvent of columns[i]) {
        if (areEventsIntersecting(event, columnEvent)) {
          isIntersectingColumnEvent = true;
          break;
        }
      }

      // If event does not intersect any event inside the column, add event to the column.
      if (!isIntersectingColumnEvent) {
        columns[i].push(event);
        idToColumn[event.id] = i;
        sortedEvents++;
        break;
      }

      // If there is at least one intersection with a column event, continue to next column.
    }
  }

  return { numOfColumns: columns.length, idToColumn };
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
