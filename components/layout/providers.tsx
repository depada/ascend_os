"use client";

import type { ReactNode } from "react";
import { createContext, useContext, useMemo, useState } from "react";

type ProvidersProps = {
  children: ReactNode;
};

type Theme = "dark" | "light";

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within Providers");
  }

  return context;
}

export function Providers({ children }: ProvidersProps) {
  const [theme, setThemeState] = useState<Theme>("dark");

  const value = useMemo(
    () => ({
      theme,
      setTheme: (nextTheme: Theme) => {
        setThemeState(nextTheme);
        document.documentElement.classList.toggle("dark", nextTheme === "dark");
      },
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
