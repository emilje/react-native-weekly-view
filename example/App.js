import React from "react";
import { SafeAreaView, StatusBar, View, Alert } from "react-native";
import { WeeklyView } from "react-native-weekly-view";
import Icon from "./components/Icon";
import { DateTime } from "luxon";

const EVENTS = [
  {
    id: 1,
    isoStart: "2023-06-23T07:00:00.000+03:00",
    isoEnd: "2023-06-23T08:00:00.000+03:00",
    name: "Breakfast",
    icon: <Icon name={"food"} size={14} />,
    disabled: true,
  },
  {
    id: 2,
    isoStart: "2023-06-23T08:30:00.000+03:00",
    isoEnd: "2023-06-23T09:00:00.000+03:00",
    name: "Lunch",
    color: "pink",
    icon: <Icon name={"food"} size={14} />,
    disabled: false,
  },
  {
    id: 3,
    isoStart: "2023-06-23T12:00:00.000+03:00",
    isoEnd: "2023-06-23T13:30:00.000+03:00",
    name: "Coding",
    icon: <Icon name={"laptop"} size={14} />,
    disabled: false,
  },
  {
    id: 4,
    isoStart: "2023-06-19T07:15:00.000+03:00",
    isoEnd: "2023-06-19T08:00:00.000+03:00",
    name: "Coding",
    icon: <Icon name={"laptop"} size={14} />,
    disabled: false,
  },
  {
    id: 5,
    isoStart: "2023-06-19T07:15:00.000+03:00",
    isoEnd: "2023-06-19T08:45:00.000+03:00",
    name: "Finish podcast",
    icon: <Icon name={"laptop"} size={14} />,
    disabled: false,
  },
  {
    id: 6,
    isoStart: "2023-06-18T09:00:00.000+03:00",
    isoEnd: "2023-06-18T11:00:00.000+03:00",
    name: "Enjoy sunday",
    disabled: false,
  },
  {
    id: 7,
    isoStart: "2023-06-16T09:00:00.000+03:00",
    isoEnd: "2023-06-16T17:00:00.000+03:00",
    name: "Survive work",
    disabled: false,
  },
  {
    id: 8,
    isoStart: "2023-06-28T09:00:00.000+03:00",
    isoEnd: "2023-06-28T11:00:00.000+03:00",
    name: "Gym",
    disabled: false,
  },
  {
    id: 9,
    isoStart: "2023-06-30T12:00:00.000+03:00",
    isoEnd: "2023-06-30T13:45:00.000+03:00",
    name: "Movies",
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
          timezone={timezone}
          events={EVENTS}
          onEventPress={(event) => {
            const eventStart = DateTime.fromISO(event.isoStart)
            const eventEnd = DateTime.fromISO(event.isoEnd);
            const length = eventEnd.diff(eventStart, ["hours", "minutes"]);
            Alert.alert(
              `${event.name} (${length.hours}:${
                length.minutes
              }h)` ,
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
