import { useEffect, useMemo, useState } from "react";
import { createMuiTheme } from "../muiTheme";

export const useTheme = () => {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  useEffect(() => {
    // Prepare listener for whenever the user changes their theme
    const themeListener = (e: MediaQueryListEvent) => {
      setThemeMode(e.matches ? "dark" : "light");
    };
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", themeListener);

    // Initialize the theme to the users preference
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      setThemeMode("dark");
    }
  }, []);

  const theme = useMemo(() => createMuiTheme(themeMode), [themeMode]);
  return theme;
};
