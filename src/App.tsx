import { ThemeProvider } from "@mui/material";
import { FC } from "react";
import { Layout } from "./Layout";
import { useTheme } from "./hooks/useTheme";

const App: FC = () => {
  const theme = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <Layout />
    </ThemeProvider>
  );
};

export default App;
