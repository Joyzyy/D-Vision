import { FC, LazyExoticComponent, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { pages } from "@/constants";
import LoadingScreen from "@/pages/Loading";

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
