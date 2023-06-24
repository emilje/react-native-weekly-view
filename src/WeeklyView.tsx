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
import { DefaultStyle, EventContainerStyle, WeeklyViewType } from "./types";

const TIMETABLE_START_HOUR = 7;
const TIMETABLE_END_HOUR = 22;
const INTERVAL_LENGTH_MINUTES = 30;
const INTERVAL_HEIGHT = 45;
const HEIGHT_PER_MINUTE = INTERVAL_HEIGHT / INTERVAL_LENGTH_MINUTES;
const COLUMN_WIDTH = 100 / 8;

const DEFAULT_STYLE = {
  light: {
    textColor: "black",
    timetableColor: "#f0f0f0",
    headerColor: "#fafafa",
    weekButtonColor: "rgba(0,0,0,0.05)",
    accentColor: "orange",
  } as DefaultStyle,
  dark: {
    textColor: "#fafafa",
    timetableColor: "rgb(30,30,40)",
    headerColor: "rgb(25,25,35)",
    weekButtonColor: "rgba(255,255,255,0.05)",
    accentColor: "orange",
  } as DefaultStyle,
};

const DEFAULT_EVENT_CONTAINER_STYLE = {
  light: {
    backgroundColor: "orange",
    borderColor: "lightgray",
    borderWidth: 0.5,
    disabledColor: "gray",
    borderRadius: 4,
  } as EventContainerStyle,
  dark: {
    backgroundColor: "darkorange",
    borderColor: "#fafafa",
    borderWidth: 1,
    borderRadius: 4,
    disabledColor: "gray",
  } as EventContainerStyle,
};

const WeeklyView = ({
  events,
  onEventPress,
  locale,
  timezone = "local",
  theme = "dark",
  eventContainerStyle,
  style
}: WeeklyViewType) => {
  const [dates, setDates] = useState(() => getStartingDates());
  const [isWeekMenu, setIsWeekMenu] = useState(false);
  const [anchor, setAnchor] = useState({ x: 0, y: 0 });
  const dropdownOpacity = useRef(new Animated.Value(0)).current;
  const dropdownHeight = useRef(new Animated.Value(0)).current;
  const parentViewHeight = useRef({ height: 0, y: 0 });
  const weekDropdownSelectorRef = useRef<View | null>(null);
  const TEXT_COLOR =style?.textColor || DEFAULT_STYLE[theme].textColor;
  const TIMETABLE_COLOR = style?.timetableColor || DEFAULT_STYLE[theme].timetableColor;
  const HEADER_COLOR = style?.headerColor || DEFAULT_STYLE[theme].headerColor;
  const PRESSABLE_COLOR = style?.weekButtonColor || DEFAULT_STYLE[theme].weekButtonColor;
  const ACCENT_COLOR = style?.accentColor || DEFAULT_STYLE[theme].accentColor;

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
            backgroundColor: DEFAULT_STYLE[theme].headerColor,
            borderBottomWidth: 0.5,
            borderBottomColor: "gray",
            gap: 8,
            alignItems: "center",
          },
          currentWeek === weekNumber && { backgroundColor: "rgba(0,0,0,0.3)" },
        ]}
      >
        <Text style={{ color: TEXT_COLOR }}>{`Week ${weekNumber}`}</Text>
        <MaterialCommunityIcons
          name="eye"
          color={ACCENT_COLOR}
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
            backgroundColor: TIMETABLE_COLOR,
            borderRadius: 8,
            borderWidth: 0.5,
            borderColor: theme === "dark" ? "#fafafa" : "darkgray",
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
        <Pressable
          onPress={() => {
            const newDates = shiftWeek(dates.start, -1);
            setDates(newDates);
          }}
          style={({ pressed }) => [
            {
              borderRadius: 99,
              borderWidth: 0.5,
              borderColor: "gray",
              opacity: pressed ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            },
          ]}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={18}
            color={"gray"}
            style={{
              padding: 8,
              aspectRatio: 1,
            }}
          />
        </Pressable>
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
              backgroundColor: PRESSABLE_COLOR,
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
            <Text style={{ color: TEXT_COLOR }}>Week {selectedIsoWeek}</Text>
            <View style={{ borderRadius: 99, overflow: "hidden" }}>
              <MaterialCommunityIcons
                style={{
                  padding: 6,
                  backgroundColor:style?.weekIconColor || HEADER_COLOR,
                  color: ACCENT_COLOR,
                }}
                name="arrow-down"
                size={12}
              />
            </View>
          </View>
        </Pressable>
        <Pressable
          onPress={() => {
            const newDates = shiftWeek(dates.start, 1);
            setDates(newDates);
          }}
          style={({ pressed }) => [
            {
              borderRadius: 99,
              borderWidth: 0.5,
              borderColor: "gray",
              opacity: pressed ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            },
          ]}
        >
          <MaterialCommunityIcons
            name="arrow-right"
            size={18}
            color={"gray"}
            style={{
              padding: 8,
              aspectRatio: 1,
            }}
          />
        </Pressable>
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
                  borderColor: isDayToday ? ACCENT_COLOR : "transparent",
                }}
              >
                {i === 0 ? (
                  <Text style={{ color: TEXT_COLOR }}>{currentDate.year} </Text>
                ) : (
                  <>
                    <Text style={{ color: TEXT_COLOR }}>
                      {day.setLocale(locale).weekdayShort}
                    </Text>
                    <Text
                      style={{
                        fontSize: 9,
                        fontWeight: "200",
                        color: TEXT_COLOR,
                      }}
                    >
                      {day.setLocale(locale).toFormat("MMM dd")}
                    </Text>

                    {weekStartYear !== weekdayYear && (
                      <Text style={{ fontSize: 9, color: TEXT_COLOR }}>
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
              position: "absolute",
              width: COLUMN_WIDTH * widthRatio + "%",
              height: eventLengthMinutes * HEIGHT_PER_MINUTE,
              overflow: "hidden",
              alignItems: "center",
              top:
                INTERVAL_HEIGHT / 2 +
                diffTimetableStartMinutes * HEIGHT_PER_MINUTE,
              left: COLUMN_WIDTH * isoWeekday + leftOffset + "%",
              opacity: pressed ? 0.5 : 1,
              backgroundColor: event.disabled
                ? eventContainerStyle?.disabledColor ||
                  DEFAULT_EVENT_CONTAINER_STYLE[theme].disabledColor
                : event.color ||
                  eventContainerStyle?.backgroundColor ||
                  DEFAULT_EVENT_CONTAINER_STYLE[theme].backgroundColor,
              borderColor:
                eventContainerStyle?.borderColor ||
                DEFAULT_EVENT_CONTAINER_STYLE[theme].borderColor,
              borderWidth:
                eventContainerStyle?.borderWidth ||
                DEFAULT_EVENT_CONTAINER_STYLE[theme].borderWidth,
              borderRadius:
                eventContainerStyle?.borderRadius ||
                DEFAULT_EVENT_CONTAINER_STYLE[theme].borderRadius,
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
              color: TEXT_COLOR,
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
          backgroundColor: DEFAULT_STYLE[theme].headerColor,
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
          backgroundColor: TIMETABLE_COLOR,
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
                  style={{ color: TEXT_COLOR, fontWeight: "100", fontSize: 14 }}
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
