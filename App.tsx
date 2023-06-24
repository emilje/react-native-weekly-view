import { SafeAreaView, StatusBar, View, Text } from "react-native";
import WeeklyView from "./src/WeeklyView";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { calendarEvent } from "./src/types";

const EVENTS: calendarEvent[] = [
  {
    id: 1,
    isoStart: "2023-06-23T07:00:00.000+03:00",
    isoEnd: "2023-06-23T08:00:00.000+03:00",
    name: "Breakfast",
    icon: <MaterialCommunityIcons name="food" size={12} />,
    disabled: true,
  },
  {
    id: 2,
    isoStart: "2023-06-23T08:30:00.000+03:00",
    isoEnd: "2023-06-23T09:00:00.000+03:00",
    name: "Lunch",
    icon: <MaterialCommunityIcons name="food" size={12} />,
    color: "pink",
    disabled: false,
  },
  {
    id: 3,
    isoStart: "2023-06-23T12:00:00.000+03:00",
    isoEnd: "2023-06-23T13:30:00.000+03:00",
    name: "Coding",
    icon: <MaterialCommunityIcons name="laptop" size={12} />,
    disabled: false,
  },
  {
    id: 4,
    isoStart: "2023-06-19T07:15:00.000+03:00",
    isoEnd: "2023-06-19T08:00:00.000+03:00",
    name: "Monday stuff",
    icon: <MaterialCommunityIcons name="car" size={12} />,
    disabled: false,
  },
  {
    id: 5,
    isoStart: "2023-06-19T07:20:00.000+03:00",
    isoEnd: "2023-06-19T08:45:00.000+03:00",
    name: "Monday stuff 2",
    disabled: false,
  },
];

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      <StatusBar />
      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={{ flex: 1 }}>
          <WeeklyView
            events={EVENTS}
            onEventPress={(event: calendarEvent) => {
              console.log("Pressed", event);
            }}
          />
          <WeeklyView
            theme="light"
            events={EVENTS}
            onEventPress={(event: calendarEvent) => {
              console.log("Pressed", event);
            }}
          />
        </View>
        {/* <View style={{ flex: 1 }}>
          <WeeklyView
            events={EVENTS}
            onEventPress={(event: calendarEvent) => {
              console.log("Pressed", event);
            }}
          />
          <WeeklyView
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
