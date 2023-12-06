import { FC, LazyExoticComponent, lazy, Suspense, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { pages } from "@/constants";
import LoadingScreen from "@/pages/Loading";
import { user_signal } from "@/lib/signals";
import { useEffect } from "react";
import { SERVER_URL } from "@/constants";

const Home: LazyExoticComponent<FC> = lazy(() => import("@/pages/Home"));
const DashboardHome: LazyExoticComponent<FC> = lazy(
  () => import("@/pages/Dashboard/Overview")
);
const DashboardEvents: LazyExoticComponent<FC> = lazy(
  () => import("@/pages/Dashboard/Events")
);
const DashboardSettings: LazyExoticComponent<FC> = lazy(
  () => import("@/pages/Dashboard/Settings")
);
const NotFound: LazyExoticComponent<FC> = lazy(
  () => import("@/pages/NotFound")
);

export default function AppRoutes() {
  useEffect(() => {
    if (localStorage.getItem("token")) {
      fetch(`${SERVER_URL}/users/current`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          user_signal.value = data.user;
          console.log(user_signal.value);
        });
    }
  }, []);

  return (
    <Routes>
      <Route
        path={pages.home}
        element={
          <Suspense fallback={<LoadingScreen />}>
            <Home />
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
        path={pages.dashboard.me}
        element={
          <Suspense fallback={<LoadingScreen />}>
            <DashboardSettings />
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
