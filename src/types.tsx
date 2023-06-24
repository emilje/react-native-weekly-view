export type eventType = {
    id:number|string,
    isoStart: string;
    isoEnd: string;
    name: string;
    disabled?: boolean;
    icon?: JSX.Element
  };

  export type WeeklyViewType = {
    events: eventType[];
    locale: string;
    onEventPress: (event: eventType) => void;
    timezone?:string
  }