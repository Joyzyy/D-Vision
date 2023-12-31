// generated by prisma
type event_access_code_type = "text" | "QR" | "both";

type event_state = "OPEN" | "CLOSED";

type event = {
  id: number;
  name: string;
  start_time: Date;
  end_time: Date;
  access_code: string;
  access_code_type: event_access_code_type;
  state: event_state;
};

export type { event };
