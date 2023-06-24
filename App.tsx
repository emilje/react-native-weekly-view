import { SafeAreaView, StatusBar, View } from "react-native";
import WeeklyView from "./src/WeeklyView";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { eventType } from "./src/types";

const EVENTS: eventType[] = [
  {
    id: 1,
    isoStart: "2023-06-23T07:00:00.000+03:00",
    isoEnd: "2023-06-23T08:00:00.000+03:00",
    name: "Breakfast",
    icon: <MaterialCommunityIcons name="food" />,
    disabled: true,
  },
  {
    id: 2,
    isoStart: "2023-06-23T08:30:00.000+03:00",
    isoEnd: "2023-06-23T09:00:00.000+03:00",
    name: "Lunch",
    icon: <MaterialCommunityIcons name="food" />,
    color: "pink",
    disabled: false,
  },
  {
    id: 3,
    isoStart: "2023-06-23T12:00:00.000+03:00",
    isoEnd: "2023-06-23T13:30:00.000+03:00",
    name: "Coding",
    icon: <MaterialCommunityIcons name="laptop" />,
    disabled: false,
  },
  {
    id: 4,
    isoStart: "2023-06-19T07:15:00.000+03:00",
    isoEnd: "2023-06-19T08:00:00.000+03:00",
    name: "Monday stuff",
    icon: <MaterialCommunityIcons name="car" />,
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
      <View style={{ flex: 1 }}>
        <WeeklyView
          eventContainerStyle={{}}
          events={EVENTS}
          locale="en"
          onEventPress={(event: eventType) => {
            console.log("Pressed", event);
          }}
        />
        <WeeklyView
          theme="light"
          events={EVENTS}
          locale="en"
          onEventPress={(event: eventType) => {
            console.log("Pressed", event);
          }}
        />
      </View>
    </SafeAreaView>
  );
}
