// src/shared/components/ThemeToggle.tsx
import { useEffect } from "react";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useThemeStore } from "../store/useThemeStore";
import { cn } from "../utils/cn";

export function ThemeToggle() {
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-1 text-sm transition-colors duration-200",

        // default state
        "bg-[var(--color-card)] text-[var(--color-text)] border border-[var(--color-border)]",

        // hover state
        "hover:bg-[var(--color-theme)] hover:text-white hover:border-[var(--color-theme-border)]"
      )}
    >
      {theme === "light" ? (
        <>
          {/* آیکن بدون رنگ → از والد ارث می‌گیرد */}
          <MoonIcon className="w-5 h-5 text-inherit" />
          Dark
        </>
      ) : (
        <>
          <SunIcon className="w-5 h-5 text-inherit" />
          Light
        </>
      )}
    </button>
  );
}