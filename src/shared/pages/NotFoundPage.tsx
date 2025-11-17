import { NavLink } from "react-router-dom";
import { ROUTE_HOME, ROUTE_LOGIN } from "../constants";

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-lg text-center py-20">

      <h1 className="text-7xl font-bold text-gray-800 mb-4">404</h1>

      <h2 className="text-2xl font-semibold text-gray-700 mb-3">
        Page Not Found
      </h2>

      <p className="text-gray-500 text-sm mb-8">
        The page you’re looking for doesn’t exist or has been moved.
      </p>

      <div className="flex justify-center gap-4">
        <NavLink
          to={ROUTE_HOME}
          className="rounded-md bg-gray-800 px-5 py-2 text-sm text-white hover:bg-gray-900 transition"
        >
          Go Home
        </NavLink>

        <NavLink
          to={ROUTE_LOGIN}
          className="rounded-md border border-gray-300 px-5 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
        >
          Login
        </NavLink>
      </div>
    </div>
  );
}