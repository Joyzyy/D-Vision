type user_role = "participant" | "event_organizer";

type user = {
  id: number;
  name: string;
  role: user_role;
  email: string;
  password: string | null;
};

export type { user };
