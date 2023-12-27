import { ThemeProvider } from "@emotion/react";
import { FC, useEffect, useState } from "react";
import { Layout } from "./Layout";
import { createMuiTheme } from "./muiTheme";

const App: FC = () => {
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

  const theme = createMuiTheme(themeMode);

  return (
    <ThemeProvider theme={theme}>
      <Layout />
    </ThemeProvider>
  );
};

export default App;
