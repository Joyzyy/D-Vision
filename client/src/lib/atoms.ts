import { atomWithStorage } from "jotai/utils";
import type { user } from "@/models/user";

export const user_atom = atomWithStorage<Omit<user, "id" | "password"> | null>(
  "user",
  null
);
