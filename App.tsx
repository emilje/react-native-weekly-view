import React from "react";
import { SafeAreaView, StatusBar, View } from "react-native";
import WeeklyView from "./src/WeeklyView";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CalendarEvent } from "./src/types";
import { DateTime } from "luxon";

const today = DateTime.now();

const EVENTS: CalendarEvent[] = [
  {
    id: 1,
    isoStart: today.set({hour:7, minute:0}).toISO() as string,
    isoEnd: today.set({hour:7, minute:30}).toISO() as string,
    name: "Breakfast",
    icon: <MaterialCommunityIcons name="food" size={12} />,
    color:"lightsalmon",
    disabled: false,
  },
  {
    id: 2,
    isoStart: today.set({hour:8, minute:0}).toISO() as string,
    isoEnd: today.set({hour:8, minute:45}).toISO() as string,
    name: "Commute",
    icon: <MaterialCommunityIcons name="bus" size={12} />,
    disabled: false,
  },
  {
    id: 3,
    isoStart: today.set({hour:9, minute:0}).toISO() as string,
    isoEnd: today.set({hour:12, minute:0}).toISO() as string,
    name: "Work",
    icon: <MaterialCommunityIcons name="laptop" size={12} />,
    color:"crimson",
    disabled: false,
  },
  {
    id: 4,
    isoStart: today.set({hour:10, minute:0}).toISO() as string,
    isoEnd: today.set({hour:10, minute:30}).toISO() as string,
    name: "Meeting",
    color:"crimson",
    icon: <MaterialCommunityIcons name="laptop" size={12} />,
    disabled: false,
  },
  {
    id: 5,
    isoStart: today.set({hour:12, minute:30}).toISO() as string,
    isoEnd: today.set({hour:13, minute:20}).toISO() as string,
    name: "Commute",
    icon: <MaterialCommunityIcons name="bus" size={12} />,
    disabled: false,
  },
  {
    id: 6,
    isoStart: today.set({hour:14, minute:0}).toISO() as string,
    isoEnd: today.set({hour:15, minute:30}).toISO() as string,
    name: "Movies",
    icon: <MaterialCommunityIcons name="movie" size={12} />,
    disabled: false,
  },
  {
    id: 7,
    isoStart: today.plus({day:3}).set({hour:7, minute:0}).toISO() as string,
    isoEnd: today.plus({day:3}).set({hour:7, minute:30}).toISO() as string,
    name: "Breakfast",
    icon: <MaterialCommunityIcons name="food" size={12} />,
    color:"lightsalmon",
    disabled: false,
  },
  {
    id: 8,
    isoStart: today.plus({day:3}).set({hour:8, minute:30}).toISO() as string,
    isoEnd: today.plus({day:3}).set({hour:10, minute:30}).toISO() as string,
    name: "Gym",
    icon: <MaterialCommunityIcons name="weight" size={12} />,
    disabled: false,
  },
  {
    id: 9,
    isoStart: today.plus({day:3}).set({hour:11, minute:15}).toISO() as string,
    isoEnd: today.plus({day:3}).set({hour:12, minute:0}).toISO() as string,
    name: "Sauna",
    icon: <MaterialCommunityIcons name="cloud" size={12} />,
    disabled: false,
  },
  {
    id: 10,
    isoStart: today.plus({day:3}).set({hour:13, minute:0}).toISO() as string,
    isoEnd: today.plus({day:3}).set({hour:14, minute:0}).toISO() as string,
    name: "Gaming",
    icon: <MaterialCommunityIcons name="laptop" size={12} />,
    disabled: false,
  },
  {
    id: 11,
    isoStart: today.plus({day:3}).set({hour:9, minute:0}).toISO() as string,
    isoEnd: today.plus({day:3}).set({hour:9, minute:30}).toISO() as string,
    name: "Breakfast",
    icon: <MaterialCommunityIcons name="food" size={12} />,
    color:"lightsalmon",
    disabled: false,
  },
  {
    id: 12,
    isoStart: today.plus({day:1}).set({hour:10, minute:0}).toISO() as string,
    isoEnd: today.plus({day:1}).set({hour:12, minute:30}).toISO() as string,
    name: "Beach time",
    icon: <MaterialCommunityIcons name="beach" size={12} />,
    disabled: false,
  },
  {
    id: 13,
    isoStart: today.plus({day:1}).set({hour:12, minute:30}).toISO() as string,
    isoEnd: today.plus({day:1}).set({hour:15, minute:0}).toISO() as string,
    name: "Family dinner",
    icon: <MaterialCommunityIcons name="food-fork-drink" size={12} />,
    color:"lightsalmon",
    disabled: false,
  },
  {
    id: 14,
    isoStart: today.plus({day:1}).set({hour:7, minute:0}).toISO() as string,
    isoEnd: today.plus({day:1}).set({hour:8, minute:55}).toISO() as string,
    name: "Extra sleep",
    icon: <MaterialCommunityIcons name="bed" size={12} />,
    color:"cornflowerblue",
    disabled: false,
  },
];

const EVENTS2 = [
  {
    id: 1,
    isoStart: today.set({ hour: 7, minute: 0 }).toISO() as string,
    isoEnd: today.set({ hour: 13, minute: 0 }).toISO() as string,
    name: "Extra sleep",
    icon: <MaterialCommunityIcons name="bed" size={12} />,
    color: "cornflowerblue",
    disabled: false,
  },
  {
    id: 2,
    isoStart: today.set({ hour: 8, minute: 0 }).toISO() as string,
    isoEnd: today.set({ hour: 10, minute: 0 }).toISO() as string,
    name: "Extra sleep",
    icon: <MaterialCommunityIcons name="bed" size={12} />,
    color: "cornflowerblue",
    disabled: false,
  },
  {
    id: 3,
    isoStart: today.set({ hour: 11, minute: 0 }).toISO() as string,
    isoEnd: today.set({ hour: 13, minute: 0 }).toISO() as string,
    name: "Extra sleep",
    icon: <MaterialCommunityIcons name="bed" size={12} />,
    color: "cornflowerblue",
    disabled: false,
  },
];

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <StatusBar barStyle={"light-content"} />
      <View style={{ flex: 1, flexDirection: "row" }}>
      <WeeklyView
            showWeekend={false}
            // style={{ fontSizeTimetable: 10, fontSizeHeader: 9, dropdownSelectedWeekIcon: <MaterialCommunityIcons name="ab-testing" color={"white"} size={12} /> }}
            timezone="Europe/Helsinki"
            events={EVENTS2}
            onEventPress={(event: CalendarEvent) => {
              console.log("Pressed", event);
            }}
          />
        {/* <View style={{ flex: 1 }}>
          <WeeklyView
            showWeekend={false}
            // style={{ fontSizeTimetable: 10, fontSizeHeader: 9, dropdownSelectedWeekIcon: <MaterialCommunityIcons name="ab-testing" color={"white"} size={12} /> }}
            timezone="Europe/Helsinki"
            events={EVENTS}
            onEventPress={(event: calendarEvent) => {
              console.log("Pressed", event);
            }}
          />
          <WeeklyView
            // theme="light"
            style={{
              headerColor: "firebrick",
              timetableColor: "salmon",
              accentColor:"beige",
              fontSizeTimetable: 10,
              fontSizeHeader: 9,
              arrowColor: "indigo",
              weekButtonColor: "rgba(0,0,0,0.1)",
              weekButtonIconColor:"teal",
              dropdownSelectedWeekIcon: <MaterialCommunityIcons name="ab-testing" color={"white"} size={14} /> 
            }}
            eventContainerStyle={{ borderWidth: 0.5, borderColor: "lightgray",  }}
            events={EVENTS}
            onEventPress={(event: calendarEvent) => {
              console.log("Pressed", event);
            }}
          />
        </View>
        <View style={{ flex: 1 }}>
          <WeeklyView
            style={{
              timetableColor: "mediumseagreen",
              headerColor: "seagreen",
              fontSizeTimetable: 10,
              fontSizeHeader: 9,
              arrowColor: "gold",
            }}
            eventContainerStyle={{ borderWidth: 0.5, borderColor: "gray" }}
            events={EVENTS}
            onEventPress={(event: calendarEvent) => {
              console.log("Pressed", event);
            }}
          />
          <WeeklyView
              style={{ fontSizeTimetable: 10, fontSizeHeader: 9 }}
            theme="light"
            events={EVENTS}
            onEventPress={(event: calendarEvent) => {
              console.log("Pressed", event);
            }}
          />
        </View> */}
      </View>
    </SafeAreaView>
  );
}
