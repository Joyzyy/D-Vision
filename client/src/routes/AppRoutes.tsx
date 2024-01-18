import { FC, LazyExoticComponent, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { pages } from "@/constants";
import LoadingScreen from "@/pages/Loading";
import { useEffect } from "react";
import { SERVER_URL } from "@/constants";
import { useAtom } from "jotai";
import { user_atom } from "@/lib/atoms";

const Portal: LazyExoticComponent<FC> = lazy(() => import("@/pages/Portal"));
const DashboardHome: LazyExoticComponent<FC> = lazy(
  () => import("@/pages/Dashboard/Overview")
);
const DashboardEvents: LazyExoticComponent<FC> = lazy(
  () => import("@/pages/Dashboard/Events")
);
const NotFound: LazyExoticComponent<FC> = lazy(
  () => import("@/pages/NotFound")
);

export default function AppRoutes() {
  const [user, setUser] = useAtom(user_atom);
  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetch(`${SERVER_URL}/users/current`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => {
          if (res.ok) return res.json();
          else throw new Error("A aparut o eroare la serverele noastre!");
        })
        .then((data) => {
          if (!user) {
            setUser(data.user);
            console.log("updated the user signal!");
          }
        })
        .catch((err: Error) => console.log(err.message));
    }
  }, []);

  return (
    <Routes>
      <Route
        path={pages.home}
        element={
          <Suspense fallback={<LoadingScreen />}>
            <Portal />
          </Suspense>
        }
      />
      <Route
        path={pages.dashboard.index}
        element={
          <Suspense fallback={<LoadingScreen />}>
            <DashboardHome />
          </Suspense>
        }
      />
      <Route
        path={pages.dashboard.events}
        element={
          <Suspense fallback={<LoadingScreen />}>
            <DashboardEvents />
          </Suspense>
        }
      />
      <Route
        path={"*"}
        element={
          <Suspense fallback={<LoadingScreen />}>
            <NotFound />
          </Suspense>
        }
      />
    </Routes>
  );
}
