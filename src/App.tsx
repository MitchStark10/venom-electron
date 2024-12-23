import { ThemeProvider } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { FC } from "react";
import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Layout } from "./Layout";
import { Feedback } from "./components/Feedback";
import { useTheme } from "./hooks/useTheme";
import { store } from "./store/store";

const App: FC = () => {
  const theme = useTheme();

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Provider store={store}>
          <ToastContainer />
          <BrowserRouter>
            <Routes>
              <Route path="/feedback" element={<Feedback />} />
              <Route path="*" element={<Layout />} />
            </Routes>
          </BrowserRouter>
        </Provider>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default App;
