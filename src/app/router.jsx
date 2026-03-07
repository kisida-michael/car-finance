import { Navigate, createBrowserRouter } from "react-router-dom";

import {
  AdminDashboardPage,
  AdminCustomersPage,
  AdminInvoicesPage,
  AdminLeadsPage,
  AdminLoginPage,
  AdminStaffPage,
  ApplicationPage,
  CustomerBillingPage,
  CustomerDashboardPage,
  CustomerLoginPage,
  CustomerPaymentsPage,
  LandingPage,
} from "./pages";
import { AdminLayout, CustomerLayout, ProtectedRoute, PublicLayout } from "./shell";

export const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        path: "apply",
        element: <ApplicationPage />,
      },
      {
        path: "auto-loan",
        element: <Navigate replace to="/" />,
      },
      {
        path: "application",
        element: <Navigate replace to="/apply" />,
      },
      {
        path: "login",
        element: <CustomerLoginPage />,
      },
      {
        path: "signup",
        element: <Navigate replace to="/login" />,
      },
      {
        path: "user",
        element: <Navigate replace to="/login" />,
      },
      {
        path: "admin/login",
        element: <AdminLoginPage />,
      },
    ],
  },
  {
    path: "/app",
    element: (
      <ProtectedRoute allowedRoles={["customer"]}>
        <CustomerLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate replace to="dashboard" />,
      },
      {
        path: "dashboard",
        element: <CustomerDashboardPage />,
      },
      {
        path: "dash",
        element: <Navigate replace to="../dashboard" />,
      },
      {
        path: "billing",
        element: <CustomerBillingPage />,
      },
      {
        path: "payments",
        element: <CustomerPaymentsPage />,
      },
      {
        path: "application",
        element: <Navigate replace to="../payments" />,
      },
    ],
  },
  {
    path: "/user/*",
    element: <Navigate replace to="/app/dashboard" />,
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Navigate replace to="dashboard" />,
      },
      {
        path: "dashboard",
        element: <AdminDashboardPage />,
      },
      {
        path: "dash",
        element: <Navigate replace to="../dashboard" />,
      },
      {
        path: "customers",
        element: <AdminCustomersPage />,
      },
      {
        path: "leads",
        element: <AdminLeadsPage />,
      },
      {
        path: "invoices",
        element: <AdminInvoicesPage />,
      },
      {
        path: "invoice",
        element: <Navigate replace to="../invoices" />,
      },
      {
        path: "staff",
        element: <AdminStaffPage />,
      },
      {
        path: "management",
        element: <Navigate replace to="../staff" />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate replace to="/" />,
  },
]);
