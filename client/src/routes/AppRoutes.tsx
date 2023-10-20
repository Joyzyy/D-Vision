import { FC, LazyExoticComponent, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { pages } from "@/constants";

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
          <Suspense fallback={<p>Loading...</p>}>
            <Home />
          </Suspense>
        }
      />
      <Route
        path={"*"}
        element={
          <Suspense fallback={<p>Loading...</p>}>
            <NotFound />
          </Suspense>
        }
      />
    </Routes>
  );
}
