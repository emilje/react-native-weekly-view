import { useState, useRef, useEffect } from "react";
import {
  Animated,
  FlatList,
  Pressable,
  ScrollView,
  View,
  Text,
} from "react-native";
import {
  shiftWeek,
  getIntersectingGroups,
  getStartingDates,
  getDatesByWeek,
  measureView,
} from "./WeekViewUtil";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { DateTime } from "luxon";
import { WeeklyViewType } from "./types";

const TIMETABLE_START_HOUR = 7;
const TIMETABLE_END_HOUR = 22;
const INTERVAL_LENGTH_MINUTES = 30;
const INTERVAL_HEIGHT = 45;
const HEIGHT_PER_MINUTE = INTERVAL_HEIGHT / INTERVAL_LENGTH_MINUTES;
const COLUMN_WIDTH = 100 / 8;
const LIGHT_BLUE = "rgb(70, 70, 80)";
const MEDIUM_BLUE = "rgb(30,30,40)";
const DARK_BLUE = "rgb(25,25,35)";

const WeeklyView = ({
  events,
  onEventPress,
  locale,
  timezone = "local",
}: WeeklyViewType) => {
  const [dates, setDates] = useState(() => getStartingDates());
  const [isWeekMenu, setIsWeekMenu] = useState(false);
  const [anchor, setAnchor] = useState({ x: 0, y: 0 });
  const dropdownOpacity = useRef(new Animated.Value(0)).current;
  const dropdownHeight = useRef(new Animated.Value(0)).current;
  const parentViewHeight = useRef({ height: 0, y: 0 });
  const weekDropdownSelectorRef = useRef<View | null>(null);

  useEffect(() => {
    const height = isWeekMenu
      ? (parentViewHeight.current.height - anchor.y) * 0.5
      : 0;
    const opacity = isWeekMenu ? 1 : 0;
    Animated.parallel([
      Animated.timing(dropdownOpacity, {
        useNativeDriver: false,
        toValue: opacity,
        duration: 300,
      }),
      Animated.timing(dropdownHeight, {
        useNativeDriver: false,
        toValue: height,
        duration: 200,
      }),
    ]).start();
  }, [isWeekMenu]);

  const renderItem = (
    weekNumber: number,
    selectedWeek: number,
    currentWeek: number
  ) => {
    return (
      <Pressable
        onPress={() => {
          setDates(getDatesByWeek(dates.start, weekNumber));
          setIsWeekMenu(false);
        }}
        style={[
          {
            flex: 1,
            flexDirection: "row",
            padding: 8,
            backgroundColor: MEDIUM_BLUE,
            borderBottomWidth: 0.5,
            borderBottomColor: "gray",
            gap: 8,
            alignItems: "center",
          },
          currentWeek === weekNumber && { backgroundColor: LIGHT_BLUE },
        ]}
      >
        <Text style={{ color: "#fafafa" }}>{`Week ${weekNumber}`}</Text>
        <MaterialCommunityIcons
          name="eye"
          color="darkorange"
          size={14}
          style={{ opacity: selectedWeek === weekNumber ? 1 : 0 }}
        />
      </Pressable>
    );
  };

  const renderWeekDropdown = () => {
    const selectedWeek = dates.start.weekNumber;
    const currentWeek = DateTime.now().weekNumber;
    const numOfWeeks = dates.start.weeksInWeekYear;
    const arr = Array(numOfWeeks).fill("");

    return (
      <Animated.View
        pointerEvents={isWeekMenu ? "auto" : "none"}
        style={{
          top: 0,
          left: 0,
          display: "flex",
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: "transparent",
          opacity: dropdownOpacity,
        }}
      >
        <Pressable
          onPress={() => {
            setIsWeekMenu(false);
          }}
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        />
        <Animated.View
          id={"animatedView"}
          style={{
            flex: 1,
            position: "absolute",
            left: anchor.x,
            top: anchor.y,
            height: dropdownHeight,
            backgroundColor: MEDIUM_BLUE,
            borderRadius: 8,
            borderWidth: 0.5,
            borderColor: "#fafafa",
            overflow: "hidden",
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
      </Animated.View>
    );
  };

  const renderWeekPicker = () => {
    const selectedIsoWeek = dates.start.weekNumber;

    return (
      <View
        style={[
          {
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 4,
            alignItems: "center",
          },
        ]}
      >
        <View
          style={{
            borderRadius: 99,
            borderWidth: 0.5,
            borderColor: "gray",
          }}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={18}
            color={"gray"}
            onPress={() => {
              const newDates = shiftWeek(dates.start, -1);
              setDates(newDates);
            }}
            style={{
              padding: 8,
              aspectRatio: 1,
            }}
          />
        </View>
        <Pressable
          ref={weekDropdownSelectorRef}
          onPress={async (e) => {
            const { pageX, pageY } = await measureView(weekDropdownSelectorRef);
            const { locationX, locationY } = e.nativeEvent;
            setAnchor({
              x: pageX + locationX,
              y: pageY + locationY,
            });
            setIsWeekMenu(true);
          }}
          style={({ pressed }) => [
            {
              backgroundColor: "rgba(255,255,255,0.05)",
              borderRadius: 99,
              padding: 8,
              justifyContent: "center",
              opacity: pressed ? 0.5 : 1,
            },
          ]}
        >
          <View
            pointerEvents="none"
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              alignItems: "center",
              gap: 8,
            }}
          >
            <Text style={{ color: "#fafafa" }}>Week {selectedIsoWeek}</Text>
            <View style={{ borderRadius: 99, overflow: "hidden" }}>
              <MaterialCommunityIcons
                style={{
                  padding: 6,
                  backgroundColor: "rgb(40,50,60)",
                  borderColor: "white",
                  color: "orange",
                }}
                name="arrow-down"
                size={12}
              />
            </View>
          </View>
        </Pressable>
        <View
          style={{
            borderRadius: 99,
            borderWidth: 0.5,
            borderColor: "gray",
          }}
        >
          <MaterialCommunityIcons
            name="arrow-right"
            size={18}
            color={"gray"}
            onPress={() => {
              const newDates = shiftWeek(dates.start, 1);
              setDates(newDates);
            }}
            style={{
              padding: 8,
              aspectRatio: 1,
            }}
          />
        </View>
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
                  <Text style={{ color: "#fafafa" }}>{currentDate.year} </Text>
                ) : (
                  <>
                    <Text style={{ color: "#fafafa" }}>
                      {day.setLocale(locale).weekdayShort}
                    </Text>
                    <Text
                      style={{
                        fontSize: 9,
                        fontWeight: "200",
                        color: "#fafafa",
                      }}
                    >
                      {day.setLocale(locale).toFormat("MMM dd")}
                    </Text>

                    {weekStartYear !== weekdayYear && (
                      <Text style={{ fontSize: 9, color: "#fafafa" }}>
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

    return filteredEvents.map((event) => {
      const eventStart = DateTime.fromISO(event.isoStart).setZone(timezone);
      const eventEnd = DateTime.fromISO(event.isoEnd).setZone(timezone);
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
          backgroundColor: DARK_BLUE,
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
          backgroundColor: MEDIUM_BLUE,
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
                <Text
                  style={{ color: "#fafafa", fontWeight: "100", fontSize: 14 }}
                >
                  {time.toFormat("HH:mm")}
                </Text>
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
    <View
      onLayout={(e) => {
        const { height, y } = e.nativeEvent.layout;
        parentViewHeight.current = { height, y };
      }}
      style={{ flex: 1 }}
    >
      {renderHeader()}
      {renderTimetable()}
      {renderWeekDropdown()}
    </View>
  );
};

export default WeeklyView;
