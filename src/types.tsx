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
  borderWidth?: number;
  borderColor?: string;
  borderRadius?: number;
  fontSize?: number;
};

export type DefaultStyle = {
  textColor?: string;
  timetableColor?: string;
  headerColor?: string;
  weekButtonColor?: string;
  weekIconColor?: string;
  accentColor?: string;
  fontSizeHeader?: number;
  fontSizeTimetable?: number;
};

export type WeeklyViewType = {
  events: calendarEvent[];
  locale?: string;
  onEventPress: (event: calendarEvent) => void;
  timezone?: string;
  theme?: "light" | "dark";
  eventContainerStyle?: EventContainerStyle;
  style?: DefaultStyle;
};
