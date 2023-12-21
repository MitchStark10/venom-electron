import { ThemeProvider } from "@emotion/react";
import { FC } from "react";
import { Layout } from "./Layout";
import { theme } from "./muiTheme";

const App: FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Layout />
    </ThemeProvider>
  );
};

export default App;
