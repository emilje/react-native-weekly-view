export type eventType = {
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
};

export type DefaultStyle = {
  textColor?: string,
  timetableColor?: string,
  headerColor?: string,
  weekButtonColor?: string,
  weekIconColor?: string,
  accentColor?: string,
}

export type WeeklyViewType = {
  events: eventType[];
  locale: string;
  onEventPress: (event: eventType) => void;
  timezone?: string;
  theme?: "light" | "dark";
  eventContainerStyle?: EventContainerStyle;
  style?: DefaultStyle
} ;
