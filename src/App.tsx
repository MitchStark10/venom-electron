import { ThemeProvider } from "@emotion/react";
import { FC, useEffect, useState } from "react";
import { Layout } from "./Layout";
import { createMuiTheme } from "./muiTheme";

const App: FC = () => {
  const [themeMode, setThemeMode] = useState<"light" | "dark">("light");
  useEffect(() => {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        setThemeMode(e.matches ? "dark" : "light");
      });
  }, []);

  const theme = createMuiTheme(themeMode);

  return (
    <ThemeProvider theme={theme}>
      <Layout />
    </ThemeProvider>
  );
};

export default App;
