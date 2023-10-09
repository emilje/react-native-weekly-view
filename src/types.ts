import { StyleProp, ViewStyle } from "react-native";

export type CalendarEvent = {
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
  weekButtonIconColor?: string;
  accentColor?: string;
  fontSizeHeader?: number;
  fontSizeTimetable?: number;
  dropdownColor?: string;
  dropdownCurrentWeekColor?: string;
  dropdownSelectedWeekIcon?: JSX.Element;
  arrowColor?:string;
};

export type WeeklyViewType = {
  events: CalendarEvent[];
  locale?: string;
  onEventPress: (event: CalendarEvent) => void;
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
