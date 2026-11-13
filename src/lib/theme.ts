import { useEffect, useState } from "react";

// Light or dark mode. The site is light by default; a visitor's choice is remembered in this browser
// and index.html applies it before the page draws, so it never flashes.
export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.classList.contains("dark") ? "dark" : "light",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Storage can be unavailable (private browsing); the choice then lasts for this visit only.
    }
    setTheme(next);
  };

  return { theme, toggle };
}
