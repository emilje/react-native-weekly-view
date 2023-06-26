import React from "react";
import { SafeAreaView, StatusBar, View } from "react-native";
import WeeklyView from "./src/WeeklyView";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { calendarEvent } from "./src/types";

const EVENTS: calendarEvent[] = [
  {
    id: 1,
    isoStart: "2023-06-19T07:00:00.000+03:00",
    isoEnd: "2023-06-19T07:30:00.000+03:00",
    name: "Breakfast",
    icon: <MaterialCommunityIcons name="food" size={12} />,
    color:"lightsalmon",
    disabled: false,
  },
  {
    id: 2,
    isoStart: "2023-06-19T08:00:00.000+03:00",
    isoEnd: "2023-06-19T08:45:00.000+03:00",
    name: "Commute",
    icon: <MaterialCommunityIcons name="bus" size={12} />,
    disabled: false,
  },
  {
    id: 3,
    isoStart: "2023-06-19T09:00:00.000+03:00",
    isoEnd: "2023-06-19T12:00:00.000+03:00",
    name: "Work",
    icon: <MaterialCommunityIcons name="laptop" size={12} />,
    color:"crimson",
    disabled: false,
  },
  {
    id: 4,
    isoStart: "2023-06-19T10:00:00.000+03:00",
    isoEnd: "2023-06-19T10:30:00.000+03:00",
    name: "Meeting",
    color:"crimson",
    icon: <MaterialCommunityIcons name="laptop" size={12} />,
    disabled: false,
  },
  {
    id: 5,
    isoStart: "2023-06-19T12:30:00.000+03:00",
    isoEnd: "2023-06-19T13:20:00.000+03:00",
    name: "Commute",
    icon: <MaterialCommunityIcons name="bus" size={12} />,
    disabled: false,
  },
  {
    id: 6,
    isoStart: "2023-06-19T14:00:00.000+03:00",
    isoEnd: "2023-06-19T15:30:00.000+03:00",
    name: "Movies",
    icon: <MaterialCommunityIcons name="movie" size={12} />,
    disabled: false,
  },
  {
    id: 7,
    isoStart: "2023-06-21T07:00:00.000+03:00",
    isoEnd: "2023-06-21T07:30:00.000+03:00",
    name: "Breakfast",
    icon: <MaterialCommunityIcons name="food" size={12} />,
    color:"lightsalmon",
    disabled: false,
  },
  {
    id: 8,
    isoStart: "2023-06-21T08:30:00.000+03:00",
    isoEnd: "2023-06-21T10:30:00.000+03:00",
    name: "Gym",
    icon: <MaterialCommunityIcons name="weight" size={12} />,
    disabled: false,
  },
  {
    id: 9,
    isoStart: "2023-06-21T11:15:00.000+03:00",
    isoEnd: "2023-06-21T12:00:00.000+03:00",
    name: "Sauna",
    icon: <MaterialCommunityIcons name="cloud" size={12} />,
    disabled: false,
  },
  {
    id: 10,
    isoStart: "2023-06-21T13:00:00.000+03:00",
    isoEnd: "2023-06-21T14:00:00.000+03:00",
    name: "Gaming",
    icon: <MaterialCommunityIcons name="laptop" size={12} />,
    disabled: false,
  },
  {
    id: 11,
    isoStart: "2023-06-24T09:00:00.000+03:00",
    isoEnd: "2023-06-24T09:30:00.000+03:00",
    name: "Breakfast",
    icon: <MaterialCommunityIcons name="food" size={12} />,
    color:"lightsalmon",
    disabled: false,
  },
  {
    id: 12,
    isoStart: "2023-06-24T10:00:00.000+03:00",
    isoEnd: "2023-06-24T12:00:00.000+03:00",
    name: "Beach time",
    icon: <MaterialCommunityIcons name="beach" size={12} />,
    disabled: false,
  },
  {
    id: 13,
    isoStart: "2023-06-24T12:30:00.000+03:00",
    isoEnd: "2023-06-24T15:00:00.000+03:00",
    name: "Family dinner",
    icon: <MaterialCommunityIcons name="food-fork-drink" size={12} />,
    color:"lightsalmon",
    disabled: false,
  },
  {
    id: 14,
    isoStart: "2023-06-24T07:00:00.000+03:00",
    isoEnd: "2023-06-24T08:55:00.000+03:00",
    name: "Extra sleep",
    icon: <MaterialCommunityIcons name="bed" size={12} />,
    color:"cornflowerblue",
    disabled: false,
  },
];

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <StatusBar barStyle={"light-content"} />
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <WeeklyView
            // showWeekend={false}
            timezone="Europe/Helsinki"
            events={EVENTS}
            onEventPress={(event: calendarEvent) => {
              console.log("Pressed", event);
            }}
          />
          {/* <WeeklyView
            intervalLengthMinutes={60}
            theme="light"
            events={EVENTS}
            onEventPress={(event: calendarEvent) => {
              console.log("Pressed", event);
            }}
          /> */}
        </View>
        {/* <View style={{ flex: 1 }}>
          <WeeklyView
            theme="dark"
            style={{ headerTextColor: "pink", timetableTextColor: "lightblue" }}
            eventContainerStyle={{ textColor: "purple", borderWidth: 0 }}
            events={EVENTS}
            onEventPress={(event: calendarEvent) => {
              console.log("Pressed", event);
            }}
          />
          <WeeklyView
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
