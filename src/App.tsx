import { ThemeProvider } from "@mui/material";
import { FC } from "react";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Layout } from "./Layout";
import { useTheme } from "./hooks/useTheme";
import { store } from "./store/store";

const App: FC = () => {
  const theme = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <ToastContainer />
        <Layout />
      </Provider>
    </ThemeProvider>
  );
};

export default App;
