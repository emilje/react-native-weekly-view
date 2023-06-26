import { useState, useRef, useEffect, useMemo } from "react";
import {
  Animated,
  FlatList,
  Pressable,
  ScrollView,
  View,
  Text,
  Image,
} from "react-native";
import {
  shiftWeek,
  getIntersectingGroups,
  getStartingDates,
  getDatesByWeek,
  measureView,
  filterAndSortEvents,
} from "./WeekViewUtil";
import { DateTime } from "luxon";
import { DefaultStyle, EventContainerStyle, WeeklyViewType } from "./types";
import Arrow from "./Arrow";

const DEFAULT_STYLE = {
  light: {
    headerColor: "#fafafa",
    headerTextColor: "black",
    timetableColor: "#f0f0f0",
    timetableTextColor: "black",
    weekButtonColor: "rgba(0,0,0,0.05)",
    accentColor: "orange",
    fontSizeHeader: 12,
    fontSizeTimetable: 12,
    dropdownCurrentWeekColor: "rgba(0,0,0,0.1)",
    dropdownColor: "#fafafa",
  } as DefaultStyle,
  dark: {
    headerColor: "rgb(25,25,35)",
    headerTextColor: "#fafafa",
    timetableColor: "rgb(30,30,40)",
    timetableTextColor: "#fafafa",
    weekButtonColor: "rgba(255,255,255,0.05)",
    accentColor: "orange",
    fontSizeHeader: 12,
    fontSizeTimetable: 12,
    dropdownCurrentWeekColor: "rgba(255,255,255,0.1)",
    dropdownColor: "rgb(25,25,35)",
  } as DefaultStyle,
};

const DEFAULT_EVENT_CONTAINER_STYLE = {
  light: {
    backgroundColor: "orange",
    borderColor: "gray",
    borderWidth: 0.5,
    disabledColor: "gray",
    borderRadius: 4,
    fontSize: 9,
    textColor: "black",
  } as EventContainerStyle,
  dark: {
    backgroundColor: "darkorange",
    borderColor: "#fafafa",
    borderWidth: 1,
    borderRadius: 4,
    disabledColor: "gray",
    fontSize: 9,
    textColor: "black",
  } as EventContainerStyle,
};

const WeeklyView = ({
  events,
  onEventPress,
  locale = "en",
  timezone = "local",
  theme = "dark",
  eventContainerStyle,
  style,
  timetableStartHour = 7,
  timetableEndHour = 22,
  intervalHeight = 45,
  intervalLengthMinutes = 30,
  translationWeek = "Week",
  showWeekend = true,
}: WeeklyViewType) => {
  const [dates, setDates] = useState(() => getStartingDates());
  const [isWeekMenu, setIsWeekMenu] = useState(false);
  const [anchor, setAnchor] = useState({ x: 0, y: 0 });
  const dropdownOpacity = useRef(new Animated.Value(0)).current;
  const dropdownHeight = useRef(new Animated.Value(0)).current;
  const parentView = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const parentViewRef = useRef(null);
  const heightPerMinute = intervalHeight / intervalLengthMinutes;
  const HEADER_TEXT_COLOR =
    style?.headerTextColor ?? DEFAULT_STYLE[theme].headerTextColor;
  const TIMETABLE_TEXT_COLOR =
    style?.timetableTextColor ?? DEFAULT_STYLE[theme].timetableTextColor;
  const TIMETABLE_COLOR =
    style?.timetableColor ?? DEFAULT_STYLE[theme].timetableColor;
  const HEADER_COLOR = style?.headerColor ?? DEFAULT_STYLE[theme].headerColor;
  const PRESSABLE_COLOR =
    style?.weekButtonColor ?? DEFAULT_STYLE[theme].weekButtonColor;
  const ACCENT_COLOR = style?.accentColor ?? DEFAULT_STYLE[theme].accentColor;
  const FONTSIZE_HEADER =
    style?.fontSizeHeader ?? DEFAULT_STYLE[theme].fontSizeHeader;
  const FONTSIZE_TIMETABLE =
    style?.fontSizeTimetable ?? DEFAULT_STYLE[theme].fontSizeTimetable;
  const DROPDOWN_CURRENT_WEEK_COLOR =
    style?.dropdownCurrentWeekColor ??
    DEFAULT_STYLE[theme].dropdownCurrentWeekColor;
  const DROPDOWN_COLOR =
    style?.dropdownColor ?? DEFAULT_STYLE[theme].dropdownColor;
  const selectedWeek = dates.start.weekNumber;
  const currentWeek = DateTime.now().weekNumber;
  const numOfWeeks = dates.start.weeksInWeekYear;
  const columnWidthPer = showWeekend ? 100 / 8 : 100 / 6;
  const arr = useMemo(() => {
    return Array(numOfWeeks).fill("");
  }, [numOfWeeks]);

  useEffect(() => {
    const height = isWeekMenu
      ? (parentView.current.height - anchor.y) * 0.5
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

  const renderFlatlist = useMemo(() => {
    const renderItem = (weekNumber: number) => {
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
              borderBottomWidth: 0.5,
              borderBottomColor: "gray",
              gap: 8,
              alignItems: "center",
            },
            currentWeek === weekNumber && {
              backgroundColor: DROPDOWN_CURRENT_WEEK_COLOR,
            },
          ]}
        >
          <Text
            style={{ color: HEADER_TEXT_COLOR, fontSize: FONTSIZE_HEADER }}
          >{`${translationWeek} ${weekNumber}`}</Text>
          <Image
            source={require("./assets/eye.png")}
            style={[
              {
                width: 14,
                aspectRatio: 1,
                tintColor: ACCENT_COLOR,
                opacity: selectedWeek === weekNumber ? 1 : 0,
              },
            ]}
          />
        </Pressable>
      );
    };

    return (
      <FlatList
        data={arr}
        renderItem={({ index }) => renderItem(index + 1)}
        keyExtractor={(_, index) => index.toString()}
      />
    );
  }, [
    arr,
    currentWeek,
    selectedWeek,
    setDates,
    setIsWeekMenu,
    dates.start,
    ACCENT_COLOR,
    DROPDOWN_CURRENT_WEEK_COLOR,
    FONTSIZE_HEADER,
    HEADER_TEXT_COLOR,
    translationWeek,
  ]);

  const renderWeekDropdown = () => {
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
            backgroundColor: DROPDOWN_COLOR,
            borderRadius: 8,
            borderWidth: 0.5,
            borderColor: theme === "dark" ? "#fafafa" : "darkgray",
            overflow: "hidden",
          }}
        >
          {renderFlatlist}
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
              opacity: pressed ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            },
          ]}
        >
          <Arrow
            orientation="LEFT"
            color="gray"
            size={32}
            style={{
              padding: 6,
              borderRadius: 99,
              borderWidth: 0.5,
              borderColor: "gray",
            }}
          />
        </Pressable>
        <Pressable
          onPress={(e) => {
            const { pageX, pageY } = e.nativeEvent;
            setAnchor({
              x: pageX - parentView.current.x,
              y: pageY - parentView.current.y,
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
            <Text
              style={{ color: HEADER_TEXT_COLOR, fontSize: FONTSIZE_HEADER }}
            >
              {translationWeek} {selectedIsoWeek}
            </Text>
            <Arrow
              orientation="DOWN"
              color={ACCENT_COLOR}
              style={{
                padding: 6,
                borderRadius: 99,
                overflow: "hidden",
                width: 24,
                aspectRatio: 1,
                backgroundColor: style?.weekButtonColor || HEADER_COLOR,
              }}
            />
          </View>
        </Pressable>
        <Pressable
          onPress={() => {
            const newDates = shiftWeek(dates.start, 1);
            setDates(newDates);
          }}
          style={({ pressed }) => [
            {
              opacity: pressed ? 0.7 : 1,
              transform: [{ scale: pressed ? 0.95 : 1 }],
            },
          ]}
        >
          <Arrow
            orientation="RIGHT"
            color="gray"
            size={32}
            style={{
              padding: 6,
              borderRadius: 99,
              borderWidth: 0.5,
              borderColor: "gray",
            }}
          />
        </Pressable>
      </View>
    );
  };

  const renderWeekdays = () => {
    const currentDate = dates.start;
    const weekdays: DateTime[] = [currentDate];
    const days = showWeekend ? 7 : 5;
    for (let i = 0; i < days; i++) {
      weekdays[i + 1] = dates.start.plus({ days: i });
    }

    return (
      <View
        style={{
          flexDirection: "row",
          marginTop: 8,
        }}
      >
        {weekdays.map((day, i) => {
          const weekStartYear = dates.start.year;
          const weekdayYear = day.year;
          const isDayToday = i !== 0 && day.hasSame(DateTime.now(), "day");

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
                <Text
                  style={{
                    color: HEADER_TEXT_COLOR,
                    fontSize: FONTSIZE_HEADER,
                  }}
                >
                  {currentDate.year}{" "}
                </Text>
              ) : (
                <>
                  <Text
                    style={{
                      color: HEADER_TEXT_COLOR,
                      fontSize: FONTSIZE_HEADER,
                    }}
                  >
                    {day.setLocale(locale).weekdayShort}
                  </Text>
                  <Text
                    style={{
                      fontSize: 9,
                      fontWeight: "200",
                      color: HEADER_TEXT_COLOR,
                    }}
                  >
                    {day.setLocale(locale).toFormat("MMM dd")}
                  </Text>

                  {weekStartYear !== weekdayYear && (
                    <Text
                      style={{
                        fontSize: 9,
                        fontWeight: "200",
                        color: HEADER_TEXT_COLOR,
                      }}
                    >
                      {weekdayYear}
                    </Text>
                  )}
                </>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  const renderEvents = () => {
    const filteredEvents = filterAndSortEvents(events, dates);
    const intersectionGroups = getIntersectingGroups(filteredEvents);

    return filteredEvents.map((event) => {
      const eventStart = DateTime.fromISO(event.isoStart).setZone(timezone);
      const eventEnd = DateTime.fromISO(event.isoEnd).setZone(timezone);
      const eventLengthMinutes = eventEnd.diff(eventStart, "minutes").minutes;
      const isoWeekday = eventStart.get("weekday");
      const dayStart = eventStart.set({
        hour: timetableStartHour,
        minute: 0,
      });

      const diffTimetableStartMinutes = eventStart.diff(
        dayStart,
        "minutes"
      ).minutes;
      let widthRatio: number;
      let leftOffsetPer: number;

      for (const eventIds of Object.values(intersectionGroups)) {
        if (eventIds.includes(event.id)) {
          widthRatio = 1 / eventIds.length;
          const index = eventIds.indexOf(event.id);
          leftOffsetPer = index * columnWidthPer * widthRatio;
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
              width: columnWidthPer * widthRatio + "%",
              height: eventLengthMinutes * heightPerMinute,
              overflow: "hidden",
              alignItems: "center",
              padding: 2,
              top:
                intervalHeight / 2 +
                diffTimetableStartMinutes * heightPerMinute,
              left: columnWidthPer * isoWeekday + leftOffsetPer + "%",
              opacity: pressed ? 0.5 : 1,
              backgroundColor: event.disabled
                ? eventContainerStyle?.disabledColor ??
                  DEFAULT_EVENT_CONTAINER_STYLE[theme].disabledColor
                : event.color ??
                  eventContainerStyle?.backgroundColor ??
                  DEFAULT_EVENT_CONTAINER_STYLE[theme].backgroundColor,
              borderColor:
                eventContainerStyle?.borderColor ??
                DEFAULT_EVENT_CONTAINER_STYLE[theme].borderColor,
              borderWidth:
                eventContainerStyle?.borderWidth ??
                DEFAULT_EVENT_CONTAINER_STYLE[theme].borderWidth,
              borderRadius:
                eventContainerStyle?.borderRadius ??
                DEFAULT_EVENT_CONTAINER_STYLE[theme].borderRadius,
            },
          ]}
        >
          {event.icon}
          <Text
            style={{
              fontSize:
                eventContainerStyle?.fontSize ??
                DEFAULT_EVENT_CONTAINER_STYLE[theme].fontSize,
              textAlign: "center",
              textDecorationLine: event.disabled ? "line-through" : "none",
              color:
                eventContainerStyle?.textColor ??
                DEFAULT_EVENT_CONTAINER_STYLE[theme].textColor,
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
          backgroundColor: HEADER_COLOR,
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
      ((timetableEndHour - timetableStartHour) * 60) / intervalLengthMinutes;

    const startTime = DateTime.now().set({
      hour: timetableStartHour,
      minute: 0,
    });

    const times = [];
    for (let i = 0; i <= intervals; i++) {
      times.push(startTime.plus({ minutes: intervalLengthMinutes * i }));
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
                height: intervalHeight,
                alignItems: "center",
              }}
            >
              <View
                style={{ width: columnWidthPer + "%", alignItems: "center" }}
              >
                <Text
                  style={{
                    color: TIMETABLE_TEXT_COLOR,
                    fontWeight: "100",
                    fontSize: FONTSIZE_TIMETABLE,
                  }}
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
      ref={parentViewRef}
      onLayout={async (e) => {
        const { pageX, pageY, width, height } = await measureView(
          parentViewRef
        );
        parentView.current = { x: pageX, y: pageY, width, height };
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
