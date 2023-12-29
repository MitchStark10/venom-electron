import { ThemeProvider } from "@mui/material";
import { FC } from "react";
import { Provider } from "react-redux";
import { Layout } from "./Layout";
import { useTheme } from "./hooks/useTheme";
import { store } from "./store/store";

const App: FC = () => {
  const theme = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <Layout />
      </Provider>
    </ThemeProvider>
  );
};

export default App;
