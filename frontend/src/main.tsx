import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { router } from "./router/router.tsx";
import { RoleProvider } from "./context/RoleProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RoleProvider>
      <RouterProvider router={router} />
    </RoleProvider>
  </StrictMode>,
);
