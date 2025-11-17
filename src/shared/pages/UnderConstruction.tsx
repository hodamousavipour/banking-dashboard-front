import { NavLink } from "react-router-dom";
import { ROUTE_DASHBOARD } from "../../shared/constants";

export default function UnderConstruction() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
      {/* Icon */}
      <div className="mb-6 text-6xl">🚧</div>

      {/* Title */}
      <h1 className="text-2xl font-semibold mb-3 text-gray-800">
        Page Under Construction
      </h1>

      {/* Description */}
      <p className="text-gray-600 max-w-md mb-6 text-sm">
        This page is currently being built and will be available soon.
        We’re working hard to bring it to you! Please check back later.
      </p>

      {/* Actions */}
      <div className="flex gap-3">
        <NavLink
          to="/"
          className="text-sm px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 transition"
        >
          Go Home
        </NavLink>

        <NavLink
          to={ROUTE_DASHBOARD}
          className="text-sm px-4 py-2 rounded-md bg-cyan-600 text-white hover:bg-cyan-700 transition"
        >
          Dashboard
        </NavLink>
      </div>
    </div>
  );
}