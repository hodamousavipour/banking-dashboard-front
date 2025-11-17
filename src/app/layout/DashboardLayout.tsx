import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import {
  Bars3Icon,
  HomeIcon,
  ArrowsRightLeftIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import { cn } from "../../shared/utils/cn";
import { ThemeToggle } from "../../shared/components/ThemeToggle";
import { ROUTE_PROFILE, ROUTE_DASHBOARD, ROUTE_TRANSACTIONS } from "../../shared/constants";

export default function DashboardLayout() {
  const [open, setOpen] = useState(false);

  const baseLinkClasses =
    "flex items-center gap-3 rounded px-3 py-2 text-sm font-medium " +
    "text-[var(--color-text-secondary)] hover:bg-[var(--color-border)]/40 hover:text-[var(--color-text)]";

  const activeLinkClasses = cn(
    "border border-[var(--color-primary)]",
    "bg-[var(--color-primary)]/15",
    "text-[var(--color-primary)] font-semibold",
    "rounded-md"
  );

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)] text-[var(--color-text)]">
      {/* Mobile Sidebar Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:static z-40 top-0 left-0 h-full md:h-screen w-60",
          "bg-[var(--color-card)] border-r border-[var(--color-border)]",
          "p-4 transition-transform duration-200",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="mb-6">
          <span className="block text-sm font-semibold text-[var(--color-text)]">
            Finance App
          </span>
          <span className="block text-xs text-[var(--color-text-secondary)]">
            Personal finance tracker
          </span>
        </div>

        <nav className="flex flex-col gap-1 mt-2">
          {/* Dashboard */}
          <NavLink
            to={ROUTE_DASHBOARD}
            className={({ isActive }) =>
              cn(baseLinkClasses, isActive && activeLinkClasses)
            }
          >
            <HomeIcon className="w-5 h-5" />
            <span>Dashboard</span>
          </NavLink>

          {/* Transactions */}
          <NavLink
            to={ROUTE_TRANSACTIONS}
            className={({ isActive }) =>
              cn(baseLinkClasses, isActive && activeLinkClasses)
            }
          >
            <ArrowsRightLeftIcon className="w-5 h-5" />
            <span>Transactions</span>
          </NavLink>

          {/* Profile */}
          <NavLink
            to={ROUTE_PROFILE}
            className={({ isActive }) =>
              cn(baseLinkClasses, isActive && activeLinkClasses)
            }
          >
            <UserCircleIcon className="w-5 h-5" />
            <span>Profile</span>
          </NavLink>
        </nav>
      </aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* AppBar */}
        <header className="h-20 px-4 flex items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-card)]">
          <div className="flex items-center gap-3 ">
            <button
              className="md:hidden p-1 rounded hover:bg-[var(--color-border)]/40 cursor-pointer"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Bars3Icon className="w-6 h-6 text-[var(--color-text)]" />
            </button>

            <div className="flex flex-col leading-tight gap-y-1 ">
              <span className="text-sm font-semibold text-[var(--color-text)]">
                Finance Dashboard
              </span>
              <span className="text-xs text-[var(--color-text-secondary)]">
                Welcome back, Hoda
              </span>
            </div>
          </div>

          <div>
            <ThemeToggle />
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}