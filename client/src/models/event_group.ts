type event_state = "OPEN" | "CLOSED";

type event_group = {
  id: number;
  name: string;
  state: event_state;
  start_time: Date;
  end_time: Date;
};

export type { event_group };
