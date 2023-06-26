import { FlexStyle, PressableProps, StyleProp, ViewStyle } from "react-native";

export type calendarEvent = {
  id: number | string;
  isoStart: string;
  isoEnd: string;
  name: string;
  disabled: boolean;
  icon?: JSX.Element;
  color?: string;
};

export type EventContainerStyle = {
  backgroundColor?: string;
  disabledColor?: string;
  borderWidth?: number | undefined;
  borderColor?: string;
  borderRadius?: number;
  fontSize?: number;
  textColor?:string
};

export type DefaultStyle = {
  headerColor?: string;
  headerTextColor?: string;
  timetableColor?: string;
  timetableTextColor?: string;
  weekButtonColor?: string;
  weekIconColor?: string;
  accentColor?: string;
  fontSizeHeader?: number;
  fontSizeTimetable?: number;
  dropdownCurrentWeekColor?: string;
  dropdownColor?: string;
};

export type WeeklyViewType = {
  events: calendarEvent[];
  locale?: string;
  onEventPress: (event: calendarEvent) => void;
  timezone?: string;
  theme?: "light" | "dark";
  eventContainerStyle?: EventContainerStyle;
  style?: DefaultStyle;
  timetableStartHour?: number;
  timetableEndHour?: number;
  intervalLengthMinutes?: number;
  intervalHeight?: number;
  translationWeek?: string;
  showWeekend?: boolean;
};

export type ArrowType = {
  orientation: "LEFT" | "RIGHT" | "UP" | "DOWN";
  size?: number;
  style?: StyleProp<ViewStyle>;
  color?: string;
};
