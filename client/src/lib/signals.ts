import { signal, computed } from "@preact/signals-react";
import type { user } from "@/models/user";

const user_signal = signal<Omit<user, "id" | "password"> | null>(null);

export { user_signal };

// export const test_signal = signal<Omit<user, "id" | "password"> | null>(null);

// export const is_logged_in = computed(() => {
//   if (localStorage.getItem("token") && test_signal.value) return true;
//   else return false;
// });

// export const UserContext = createContext<{
//   user_signal: ReturnType<typeof create_user_signal>["user_signal"];
//   isLoggedIn: ReturnType<typeof create_user_signal>["isLoggedIn"];
// }>({
//   user_signal: signal(null),
//   isLoggedIn: computed(() => false),
// });

// export const create_user_signal = () => {
//   const user_signal = signal<Omit<user, "id" | "password"> | null>(null);

//   const isLoggedIn = computed(() => {
//     if (localStorage.getItem("token")) return true;
//     else return false;
//   });

//   const isLoading = computed(() => {
//     if (user_signal.value === null) return true;
//     else return false;
//   });

//   return { user_signal, isLoggedIn, isLoading };
// };
