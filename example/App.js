import React from "react";
import { SafeAreaView, StatusBar, View, Alert } from "react-native";
import { WeeklyView } from "react-native-weekly-view";
import Icon from "./components/Icon";
import { DateTime } from "luxon";

const today = DateTime.now();

const EVENTS = [
  {
    id: 1,
    isoStart: today.set({hour:7, minute:0}).toISO(),
    isoEnd: today.set({hour:8, minute:0}).toISO(),
    name: "Breakfast",
    icon: <Icon name={"food"} size={14} />,
    disabled: true,
  },
  {
    id: 2,
    isoStart: today.set({hour:8, minute:30}).toISO(),
    isoEnd: today.set({hour:9, minute:0}).toISO(),
    name: "Lunch",
    color: "pink",
    icon: <Icon name={"food"} size={14} />,
    disabled: false,
  },
  {
    id: 3,
    isoStart: today.set({hour:12, minute:30}).toISO(),
    isoEnd: today.set({hour:13, minute:30}).toISO(),
    name: "Coding",
    icon: <Icon name={"laptop"} size={14} />,
    disabled: false,
  },
  {
    id: 4,
    isoStart: today.minus({day:1}).set({hour:7, minute:15}).toISO(),
    isoEnd: today.minus({day:1}).set({hour:8, minute:0}).toISO(),
    name: "Coding",
    icon: <Icon name={"laptop"} size={14} />,
    disabled: false,
  },
  {
    id: 5,
    isoStart: today.minus({day:1}).set({hour:7, minute:15}).toISO(),
    isoEnd: today.minus({day:1}).set({hour:8, minute:45}).toISO(),
    name: "Finish podcast",
    icon: <Icon name={"laptop"} size={14} />,
    disabled: false,
  },
  {
    id: 6,
    isoStart: today.minus({day:1}).set({hour:9, minute:0}).toISO(),
    isoEnd: today.minus({day:1}).set({hour:11, minute:0}).toISO(),
    name: "Enjoy well earned rest",
    disabled: false,
  },
  {
    id: 7,
    isoStart: today.plus({day:1}).set({hour:7, minute:0}).toISO(),
    isoEnd: today.plus({day:1}).set({hour:12, minute:0}).toISO(),
    name: "Survive work",
    disabled: false,
  },
  {
    id: 13,
    isoStart: today.plus({day:1}).set({hour:10, minute:0}).toISO(),
    isoEnd: today.plus({day:1}).set({hour:11, minute:0}).toISO(),
    name: "Survive work",
    disabled: false,
  },
  {
    id: 14,
    isoStart: today.plus({day:1}).set({hour:8, minute:0}).toISO(),
    isoEnd: today.plus({day:1}).set({hour:9, minute:0}).toISO(),
    name: "More randomness",
    disabled: false,
  },
  {
    id: 15,
    isoStart: today.plus({day:1}).set({hour:8, minute:0}).toISO(),
    isoEnd: today.plus({day:1}).set({hour:11, minute:0}).toISO(),
    name: "Random nest",
    disabled: false,
  },
  {
    id: 8,
    isoStart: today.plus({day:1}).set({hour:14, minute:0}).toISO(),
    isoEnd: today.plus({day:1}).set({hour:16, minute:0}).toISO(),
    name: "Gym",
    disabled: false,
  },
  {
    id: 9,
    isoStart: today.plus({day:2}).set({hour:12, minute:0}).toISO(),
    isoEnd: today.plus({day:2}).set({hour:13, minute:45}).toISO(),
    name: "Movies",
    disabled: false,
  },
  {
    id: 10,
    isoStart: today.minus({day:7}).set({hour:8, minute:0}).toISO(),
    isoEnd: today.minus({day:7}).set({hour:14, minute:0}).toISO(),
    name: "Movies",
    disabled: false,
  },
  {
    id: 11,
    isoStart: today.minus({day:7}).set({hour:8, minute:30}).toISO(),
    isoEnd: today.minus({day:7}).set({hour:10, minute:0}).toISO(),
    name: "Snacks",
    disabled: false,
  },
  {
    id: 12,
    isoStart: today.minus({day:7}).set({hour:11, minute:0}).toISO(),
    isoEnd: today.minus({day:7}).set({hour:12, minute:0}).toISO(),
    name: "Random nested event",
    disabled: false,
  },
];

export default function App() {
  // The calendar displays the events and accounts for the time difference between the selected timezone and the event's timezone. Imagine an event booked at 12:00 in the timezone which is 1 hour in the future compared to selected timezone. The calendar would display this event starting at 11:00, because at this point in time its 12:00 in the event's timezone - 1 hour in the future from the selected timezone!
  const timezone = "Europe/Zagreb";

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <StatusBar translucent={false} barStyle="light-content" />
      <View style={{ flex: 1 }}>
        <WeeklyView
        showWeekend={false}
          timetableStartHour={6}
          timezone={timezone}
          events={EVENTS}
          onEventPress={(event) => {
            const eventStart = DateTime.fromISO(event.isoStart);
            const eventEnd = DateTime.fromISO(event.isoEnd);
            const length = eventEnd.diff(eventStart, ["hours", "minutes"]);
            Alert.alert(
              `${event.name} (${length.hours}:${length.minutes}h)`,
              `Event timezone \nFrom ${eventStart.toFormat(
                "HH:mm"
              )} to ${eventEnd.toFormat("HH:mm")}.
              \nSelected zone (${timezone})\nFrom ${eventStart
                .setZone(timezone)
                .toFormat("HH:mm")} to ${eventEnd
                .setZone(timezone)
                .toFormat("HH:mm")}
              \nUTC\nFrom ${eventStart
                .setZone("utc")
                .toFormat("HH:mm")} to ${eventEnd
                .setZone("utc")
                .toFormat("HH:mm")}
              \nCET\nFrom ${eventStart
                .setZone("cet")
                .toFormat("HH:mm")} to ${eventEnd
                .setZone("cet")
                .toFormat("HH:mm")}
                
              `
            );
          }}
        />
      </View>
    </SafeAreaView>
  );
}
