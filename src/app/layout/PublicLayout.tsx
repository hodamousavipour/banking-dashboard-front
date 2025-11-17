import { Outlet, NavLink } from "react-router-dom";
import { ROUTE_ABOUT,ROUTE_LOGIN } from "../../shared/constants";

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="border-b bg-white px-4 py-3 sm:px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <NavLink to="/" className="text-base sm:text-lg font-semibold">
          Finance Web Application
        </NavLink>

        <nav className="flex gap-3 text-sm">
          <NavLink to={ROUTE_LOGIN} className="hover:underline">
            Login
          </NavLink>
          <NavLink to={ROUTE_ABOUT} className="hover:underline">
            About
          </NavLink>
        </nav>
      </header>

      <main className="flex-1 px-4 py-6 sm:px-6">
        <Outlet />
      </main>

      <footer className="px-4 py-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Frontend Assessment
      </footer>
    </div>
  );
}