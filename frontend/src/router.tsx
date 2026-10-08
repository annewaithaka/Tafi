import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { AppShell } from "@/components/app-shell";
import { DashboardPage } from "@/routes/dashboard";
import { OrganizationsPage } from "@/routes/organizations";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "organizations", element: <OrganizationsPage /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
