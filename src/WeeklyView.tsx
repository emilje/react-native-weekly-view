import { useCallback, useState, useRef, useMemo } from "react";
import { Animated, FlatList, Pressable, ScrollView, View } from "react-native";
import {
  shiftWeek,
  getIntersectingGroups,
  getStartingDates,
  getDatesByWeek,
  eventType,
} from "./WeekViewUtil";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Menu,
  IconButton,
  Text,
  PaperProvider,
  MD3LightTheme,
  MD3Theme,
  MD2Theme,
} from "react-native-paper";
import { DateTime } from "luxon";
import { measureView } from "./functions";

const TIMETABLE_START_HOUR = 7;
const TIMETABLE_END_HOUR = 22;
const INTERVAL_LENGTH_MINUTES = 30;
const INTERVAL_HEIGHT = 45;
const HEIGHT_PER_MINUTE = INTERVAL_HEIGHT / INTERVAL_LENGTH_MINUTES;
const COLUMN_WIDTH = 100 / 8;

const WeeklyView = ({
  events,
  onEventPress,
  locale,
}: {
  events: any[];
  locale: string;
  onEventPress: (event: eventType) => void;
}): any => {
  const [dates, setDates] = useState(() => getStartingDates());
  const [isWeekMenu, setIsWeekMenu] = useState(false);
  const [anchor, setAnchor] = useState({ x: 0, y: 0 });
  const pressableRef = useRef({ x: 0, y: 0 });
  // const renderWeekDropdown = () => {
  //   const selectedWeek = dates.start.weekNumber;
  //   const currentWeek = DateTime.now().weekNumber;
  //   const numOfWeeks = dates.start.weeksInWeekYear;
  //   const arr = Array(numOfWeeks).fill("");

  //   return arr.map((_, i) => (
  //     <Menu.Item
  //       key={i}
  //       onPress={() => {
  //         setDates(getDatesByWeek(dates.start, i + 1));
  //         setIsWeekMenu(false);
  //       }}
  //       trailingIcon={() =>
  //         selectedWeek === i + 1 ? (
  //           <View style={{ flex: 1, justifyContent: "center" }}>
  //             <MaterialCommunityIcons name="eye" color="orange" size={18} />
  //           </View>
  //         ) : null
  //       }
  //       title={`Week ${i + 1}`}
  //       style={currentWeek === i + 1 && { backgroundColor: "darkblue" }}
  //     />
  //   ));
  // };
  const renderItem = useCallback(
    (weekNumber: number, selectedWeek: number, currentWeek: number) => {
      return (
        <View
          style={[
            {
              flex: 1,
              flexDirection: "row",
              padding: 8,
              backgroundColor: "rgb(15,0,45)",
              borderBottomWidth: 1,
              borderBottomColor: "white",
              gap: 8,
              alignItems: "center",
            },
            currentWeek === weekNumber && { backgroundColor: "darkblue" },
          ]}
        >
          <Text style={{ color: "#fafafa" }}>{`Week ${weekNumber}`}</Text>
          {selectedWeek === weekNumber && (
            <MaterialCommunityIcons name="eye" color="orange" size={14} />
          )}
        </View>
      );
    },
    []
  );

  const renderWeekDropdown = () => {
    const selectedWeek = dates.start.weekNumber;
    const currentWeek = DateTime.now().weekNumber;
    const numOfWeeks = dates.start.weeksInWeekYear;
    const arr = Array(numOfWeeks).fill("");

    return (
      <View
        style={{
          top: 0,
          left: 0,
          display: isWeekMenu ? "flex" : "none",
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
      >
        <Pressable
          onPress={() => setIsWeekMenu(false)}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.6)",
          }}
        />
        <Animated.View
          id={"animatedView"}
          style={{
            flex: 1,
            position: "absolute",
            left: anchor.x,
            top: anchor.y,
            height: "40%",
            backgroundColor: "rgba(0,0,16,0.8)",
          }}
        >
          <FlatList
            data={arr}
            renderItem={({ index }) =>
              renderItem(index + 1, selectedWeek, currentWeek)
            }
            keyExtractor={(_, index) => index.toString()}
          />
        </Animated.View>
      </View>
    );
  };

  const renderWeekPicker = () => {
    const selectedIsoWeek = dates.start.weekNumber;

    return (
      <View
        style={[
          { flexDirection: "row", justifyContent: "space-between", padding: 4 },
        ]}
      >
        <IconButton
          onPress={() => {
            const newDates = shiftWeek(dates.start, -1);

            setDates(newDates);
          }}
          mode="outlined"
          icon="arrow-left"
          style={{ margin: 0 }}
        />

        <Pressable
          onLayout={(e) => {
            const { x, y } = e.nativeEvent.layout;
            pressableRef.current = { x, y };
          }}
          onPress={(e) => {
            const { locationX, locationY } = e.nativeEvent;
            setAnchor({
              x: pressableRef.current.x + locationX,
              y: pressableRef.current.y + locationY,
            });
            setIsWeekMenu(true);
          }}
          style={({ pressed }) => [
            {
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: 99,
              padding: 8,

              opacity: pressed ? 0.5 : 1,
            },
          ]}
        >
          <View
            pointerEvents="none"
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              gap: 8,
            }}
          >
            <Text variant="titleMedium">Week {selectedIsoWeek}</Text>
            <IconButton
              icon="arrow-down"
              mode="contained"
              size={12}
              style={{ margin: 0, padding: 0 }}
            />
          </View>
        </Pressable>

        <IconButton
          onPress={() => {
            const newDates = shiftWeek(dates.start, 1);

            setDates(newDates);
          }}
          mode="outlined"
          icon="arrow-right"
          style={{ margin: 0 }}
        />
      </View>
    );
  };

  const renderWeekdays = () => {
    const currentDate = dates.start;
    const weekdays: DateTime[] = [currentDate];
    for (let i = 0; i < 7; i++) {
      weekdays[i + 1] = dates.start.plus({ days: i });
    }

    return (
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-start",
            width: "100%",
          }}
        >
          {weekdays.map((day, i) => {
            const weekStartYear = dates.start.year;
            const weekdayYear = day.year;
            const isDayToday = day.hasSame(DateTime.now(), "day");

            return (
              <View
                key={i}
                style={{
                  flex: 1,
                  paddingBottom: 8,
                  alignItems: "center",
                  alignSelf: i === 0 ? "center" : "flex-start",
                  borderBottomWidth: 2,
                  borderColor: isDayToday ? "orange" : "transparent",
                }}
              >
                {i === 0 ? (
                  <Text variant="bodyMedium">{currentDate.year} </Text>
                ) : (
                  <>
                    <Text variant="bodyMedium">
                      {day.setLocale(locale).weekdayShort}
                    </Text>
                    <Text style={{ fontSize: 9 }} variant="bodySmall">
                      {day.setLocale(locale).toFormat("MMM dd")}
                    </Text>

                    {weekStartYear !== weekdayYear && (
                      <Text style={{ fontSize: 9 }} variant="bodySmall">
                        {weekdayYear}
                      </Text>
                    )}
                  </>
                )}
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderEvents = () => {
    const filteredEvents = events.filter((event) => {
      const startDate = DateTime.fromISO(event.isoStart);

      return startDate >= dates.start && startDate <= dates.start.endOf("week");
    });

    const intersectionGroups = getIntersectingGroups(filteredEvents);

    return filteredEvents.map((event: eventType) => {
      const eventStart = DateTime.fromISO(event.isoStart);
      const eventEnd = DateTime.fromISO(event.isoEnd);
      const eventLengthMinutes = eventEnd.diff(eventStart, "minutes").minutes;
      const isoWeekday = eventStart.get("weekday");
      const dayStart = eventStart.set({
        hour: TIMETABLE_START_HOUR,
        minute: 0,
      });

      const diffTimetableStartMinutes = eventStart.diff(
        dayStart,
        "minutes"
      ).minutes;
      let widthRatio: number;
      let leftOffset: number;

      for (const eventIds of Object.values(intersectionGroups)) {
        if (eventIds.includes(event.id)) {
          widthRatio = 1 / eventIds.length;
          const index = eventIds.indexOf(event.id);
          leftOffset = index * COLUMN_WIDTH * widthRatio;
          break;
        }
      }

      return (
        <Pressable
          onPress={() => {
            onEventPress(event);
          }}
          key={event.id}
          style={({ pressed }) => [
            {
              width: COLUMN_WIDTH * widthRatio + "%",
              height: eventLengthMinutes * HEIGHT_PER_MINUTE,
              backgroundColor: event.disabled ? "gray" : "orange",
              borderColor: "white",
              borderWidth: 1,
              position: "absolute",
              borderRadius: 4,
              overflow: "hidden",
              alignItems: "center",
              top:
                INTERVAL_HEIGHT / 2 +
                diffTimetableStartMinutes * HEIGHT_PER_MINUTE,
              left: COLUMN_WIDTH * isoWeekday + leftOffset + "%",
              opacity: pressed ? 0.5 : 1,
            },
          ]}
        >
          {event.icon}
          <Text
            style={{
              fontSize: 10,
              flex: 1,
              textAlign: "center",
              textDecorationLine: event.disabled ? "line-through" : "none",
            }}
            variant="bodySmall"
          >
            {event.name}
          </Text>
        </Pressable>
      );
    });
  };

  const renderHeader = () => {
    return (
      <View
        style={{
          backgroundColor: "#rgba(10,10,10,0.4)",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
        }}
      >
        {renderWeekPicker()}
        {renderWeekdays()}
      </View>
    );
  };

  const renderTimetable = () => {
    const intervals =
      ((TIMETABLE_END_HOUR - TIMETABLE_START_HOUR) * 60) /
      INTERVAL_LENGTH_MINUTES;

    const startTime = DateTime.now().set({
      hour: TIMETABLE_START_HOUR,
      minute: 0,
    });

    const times = [];
    for (let i = 0; i <= intervals; i++) {
      times.push(startTime.plus({ minutes: INTERVAL_LENGTH_MINUTES * i }));
    }

    return (
      <ScrollView
        style={{
          backgroundColor: "rgba(10,10,10,0.15)",
          marginBottom: 8,
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
        }}
      >
        {times.map((time) => {
          return (
            <View
              key={time.toString()}
              style={{
                flexDirection: "row",
                height: INTERVAL_HEIGHT,
                alignItems: "center",
              }}
            >
              <View style={{ width: COLUMN_WIDTH + "%", alignItems: "center" }}>
                <Text variant="bodySmall">{time.toFormat("HH:mm")}</Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                  height: 0.5,
                  backgroundColor: "gray",
                }}
              />
            </View>
          );
        })}
        {renderEvents()}
      </ScrollView>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      {renderHeader()}
      {renderTimetable()}
      {renderWeekDropdown()}
    </View>
  );
};

export default WeeklyView;
