// src/shared/store/useThemeStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",

      setTheme: (theme) => set({ theme }),

      toggleTheme: () => {
        const current = get().theme;
        set({ theme: current === "light" ? "dark" : "light" });
      },
    }),
    {
      name: "theme", // key in localStorage
      // only persist what we need
      partialize: (state) => ({ theme: state.theme }),
    }
  )
);