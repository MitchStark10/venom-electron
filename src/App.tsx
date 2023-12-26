import { ThemeProvider } from "@emotion/react";
import { FC, useEffect, useState } from "react";
import { Layout } from "./Layout";
import { createMuiTheme } from "./muiTheme";

const App: FC = () => {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  useEffect(() => {
    const themeListener = (e: MediaQueryListEvent) => {
      setThemeMode(e.matches ? "dark" : "light");
    };

    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", themeListener);
  }, []);

  const theme = createMuiTheme(themeMode);

  return (
    <ThemeProvider theme={theme}>
      <Layout />
    </ThemeProvider>
  );
};

export default App;
