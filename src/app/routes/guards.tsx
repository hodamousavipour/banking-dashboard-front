import { Navigate, Outlet } from "react-router-dom";
import { ROUTE_LOGIN } from "../../shared/constants"; 
/**
 * Simulated auth guard.
 */
export function PrivateRoute() {
  const isAuthenticated = true; //  assume user is logged in

  if (!isAuthenticated) {
    return <Navigate to={ROUTE_LOGIN} replace />;
  }

  return <Outlet />;
}