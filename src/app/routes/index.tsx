import { Navigate, useRoutes } from "react-router-dom";
import DashboardLayout from "../layout/DashboardLayout";
import PublicLayout from "../layout/PublicLayout";
import { PrivateRoute } from "./guards";
import { lazy } from "react";
import { ROUTE_HOME, ROUTE_LOGIN, ROUTE_DASHBOARD, ROUTE_TRANSACTIONS,ROUTE_PROFILE } from "../../shared/constants";
import NotFoundPage from "../../shared/pages/NotFoundPage";
import UnderConstruction from "../../shared/pages/UnderConstruction";

const DashboardPage = lazy(() => import("../../features/dashboard/pages/DashboardPage"));
const TransactionsPage = lazy(() => import("../../features/transactions/pages/TransactionsPage"));
// const LoginPage = lazy(() => import("../../features/auth/pages/LoginPage")); 


export function AppRoutes() {
  return useRoutes([
    {
      element: <PublicLayout />,
      children: [
        { path: ROUTE_HOME, element: <Navigate to={ROUTE_DASHBOARD} replace /> },
        { path: ROUTE_LOGIN, element: <Navigate to={ROUTE_DASHBOARD} replace/> } ,//  assume user is logged in and redirect to dashboard
      ],
    },
    {
      element: <PrivateRoute />,//  assume user is logged in and redirect to dashboard
      children: [
        {
          element: <DashboardLayout />,
          children: [
            { path: ROUTE_DASHBOARD, element: <DashboardPage /> },
            { path: ROUTE_TRANSACTIONS, element: <TransactionsPage /> },
          ],
        },
      ],
    },
    { path: ROUTE_PROFILE, element: <UnderConstruction /> },
    { path: "*", element: <NotFoundPage /> },

  ]);
}