import React from "react";
import ReactDOM from "react-dom/client";
import {
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
  Outlet,
  Link,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import Index from "./routes/index";
import XStateCount from "./routes/xstate_count";
import Audio from "./routes/audio";

import "./index.css";
import "./App.css";

export const rootRoute = createRootRoute({
  component: () => (
    <>
      <div>
        <div>
          <Link to="/">Home</Link> / <Link to="/xstate-count">XStateCount</Link>{" "}
          / <Link to="/audio">Audio</Link>
        </div>
        <div className="container">
          <Outlet />
        </div>
        <TanStackRouterDevtools />
      </div>
    </>
  ),
});

const router = createRouter({
  routeTree: rootRoute.addChildren([
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/",
      component: Index,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/xstate-count",
      component: XStateCount,
    }),
    createRoute({
      getParentRoute: () => rootRoute,
      path: "/audio",
      component: Audio,
    }),
  ]),
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Render the app
const rootElement = document.getElementById("app")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>,
  );
}
