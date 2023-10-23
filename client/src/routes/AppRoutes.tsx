import { FC, LazyExoticComponent, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { pages } from "@/constants";
import LoadingScreen from "@/pages/Loading";

const Home: LazyExoticComponent<FC> = lazy(() => import("@/pages/Home"));

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
